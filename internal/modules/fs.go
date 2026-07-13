package modules

import (
	"github.com/dop251/goja"
	"io/ioutil"
)

func RegisterFS(vm *goja.Runtime) {
	fs := vm.NewObject()
	fs.Set("readFile", func(path string) string {
		data, err := ioutil.ReadFile(path)
		if err != nil {
			panic(vm.NewGoError(err))
		}
		return string(data)
	})
	fs.Set("writeFile", func(path string, content string) {
		err := ioutil.WriteFile(path, []byte(content), 0644)
		if err != nil {
			panic(vm.NewGoError(err))
		}
	})
	vm.Set("fs", fs)
}
