package engine

import (
	"fmt"
	"strings"

	"github.com/evanw/esbuild/pkg/api"
)

func BuildFile(inputPath, outputPath string) error {
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
