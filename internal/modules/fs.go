package modules

import (
	"io/ioutil"
	"os"

	"github.com/dop251/goja"
)

func RegisterFS(vm *goja.Runtime) {
	fs := vm.NewObject()

	readFile := func(path string) string {
		data, err := ioutil.ReadFile(path)
		if err != nil {
			panic(vm.NewGoError(err))
		}
		return string(data)
	}

	writeFile := func(path string, content string) {
		err := ioutil.WriteFile(path, []byte(content), 0644)
		if err != nil {
			panic(vm.NewGoError(err))
		}
	}

	readdirSync := func(path string) []string {
		entries, err := os.ReadDir(path)
		if err != nil {
			panic(vm.NewGoError(err))
		}
		names := make([]string, len(entries))
		for i, entry := range entries {
			names[i] = entry.Name()
		}
		return names
	}

	fs.Set("readFile", readFile)
	fs.Set("readFileSync", readFile)
	fs.Set("writeFile", writeFile)
	fs.Set("writeFileSync", writeFile)
	fs.Set("readdirSync", readdirSync)
	fs.Set("readdir", readdirSync)

	fs.Set("existsSync", func(path string) bool {
		_, err := os.Stat(path)
		return err == nil
	})
	fs.Set("exists", func(path string) bool {
		_, err := os.Stat(path)
		return err == nil
	})

	fs.Set("mkdirSync", func(path string) {
		err := os.MkdirAll(path, 0755)
		if err != nil {
			panic(vm.NewGoError(err))
		}
	})

	fs.Set("unlinkSync", func(path string) {
		err := os.Remove(path)
		if err != nil {
			panic(vm.NewGoError(err))
		}
	})

	vm.Set("fs", fs)
}
