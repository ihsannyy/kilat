package engine

import (
	"fmt"
	"path/filepath"
	"strings"

	"github.com/evanw/esbuild/pkg/api"
)

func BuildFile(inputPath, outputPath string) error {
	absInput, err := filepath.Abs(inputPath)
	if err == nil {
		inputPath = absInput
	}

	kilatPlugin := api.Plugin{
		Name: "kilat-resolver",
		Setup: func(build api.PluginBuild) {
			build.OnResolve(api.OnResolveOptions{Filter: ".*"}, func(args api.OnResolveArgs) (api.OnResolveResult, error) {
				// Mark Kilat built-in modules as external
				if args.Path == "os" || args.Path == "fs" || args.Path == "net" || args.Path == "console" || args.Path == "bun" || args.Path == "crypto" {
					return api.OnResolveResult{Path: args.Path, External: true}, nil
				}

				// Let esbuild handle relative/absolute file imports natively
				if strings.HasPrefix(args.Path, ".") || strings.HasPrefix(args.Path, "/") || filepath.IsAbs(args.Path) {
					return api.OnResolveResult{}, nil
				}

				// Resolve third-party packages from .kilat/packages
				resolved, err := resolvePath(args.ResolveDir, args.Path)
				if err == nil {
					return api.OnResolveResult{Path: resolved}, nil
				}

				return api.OnResolveResult{}, nil
			})
		},
	}

	res := api.Build(api.BuildOptions{
		EntryPoints:       []string{inputPath},
		Outfile:           outputPath,
		Bundle:            true,
		Write:             true,
		Platform:          api.PlatformNode,
		Format:            api.FormatCommonJS,
		Target:            api.ES2015,
		MinifyWhitespace:  true,
		MinifyIdentifiers: true,
		MinifySyntax:      true,
		Plugins:           []api.Plugin{kilatPlugin},
	})

	if len(res.Errors) > 0 {
		var errMsg strings.Builder
		for _, msg := range res.Errors {
			errMsg.WriteString(fmt.Sprintf("%s:%d:%d: error: %s\n", msg.Location.File, msg.Location.Line, msg.Location.Column, msg.Text))
		}
		return fmt.Errorf("build error: %s", errMsg.String())
	}

	return nil
}
