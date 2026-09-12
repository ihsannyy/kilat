package modules

import (
	"path/filepath"
	"strings"

	"github.com/dop251/goja"
)

func RegisterPath(vm *goja.Runtime) {
	pathModule := vm.NewObject()

	pathModule.Set("join", func(parts ...string) string {
		return filepath.Join(parts...)
	})

	pathModule.Set("resolve", func(parts ...string) string {
		if len(parts) == 0 {
			cwd, err := filepath.Abs(".")
			if err != nil {
				return "."
			}
			return cwd
		}
		result := parts[0]
		for i := 1; i < len(parts); i++ {
			if filepath.IsAbs(parts[i]) {
				result = parts[i]
			} else {
				result = filepath.Join(result, parts[i])
			}
		}
		abs, err := filepath.Abs(result)
		if err != nil {
			return result
		}
		return abs
	})

	pathModule.Set("basename", func(path string, ext ...string) string {
		base := filepath.Base(path)
		if len(ext) > 0 && ext[0] != "" {
			if strings.HasSuffix(base, ext[0]) {
				base = base[:len(base)-len(ext[0])]
			}
		}
		return base
	})

	pathModule.Set("extname", func(path string) string {
		return filepath.Ext(path)
	})

	pathModule.Set("dirname", func(path string) string {
		return filepath.Dir(path)
	})

	pathModule.Set("relative", func(from, to string) string {
		rel, err := filepath.Rel(from, to)
		if err != nil {
			return to
		}
		return rel
	})

	pathModule.Set("isAbsolute", func(path string) bool {
		return filepath.IsAbs(path)
	})

	pathModule.Set("normalize", func(path string) string {
		return filepath.Clean(path)
	})

	pathModule.Set("sep", string(filepath.Separator))
	pathModule.Set("delimiter", string(filepath.ListSeparator))

	pathModule.Set("parse", func(path string) goja.Value {
		dir := filepath.Dir(path)
		base := filepath.Base(path)
		ext := filepath.Ext(base)
		name := strings.TrimSuffix(base, ext)

		obj := vm.NewObject()
		obj.Set("root", "")
		obj.Set("dir", dir)
		obj.Set("base", base)
		obj.Set("ext", ext)
		obj.Set("name", name)
		return obj
	})

	pathModule.Set("format", func(obj goja.Value) string {
		o := obj.ToObject(vm)
		dir := o.Get("dir").String()
		base := o.Get("base").String()
		if base == "" {
			name := o.Get("name").String()
			ext := o.Get("ext").String()
			base = name + ext
		}
		if dir == "" {
			return base
		}
		return filepath.Join(dir, base)
	})

	vm.Set("path", pathModule)
}
