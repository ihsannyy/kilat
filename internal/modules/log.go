package modules

import (
	"fmt"
	"time"

	"github.com/dop251/goja"
)

func RegisterLog(vm *goja.Runtime) {
	logModule := vm.NewObject()

	logModule.Set("info", func(args ...goja.Value) goja.Value {
		msg := formatArgs(vm, args)
		fmt.Printf("%s \033[36mINFO\033[0m %s\n", time.Now().Format("15:04:05"), msg)
		return goja.Undefined()
	})

	logModule.Set("warn", func(args ...goja.Value) goja.Value {
		msg := formatArgs(vm, args)
		fmt.Printf("%s \033[33mWARN\033[0m %s\n", time.Now().Format("15:04:05"), msg)
		return goja.Undefined()
	})

	logModule.Set("error", func(args ...goja.Value) goja.Value {
		msg := formatArgs(vm, args)
		fmt.Printf("%s \033[31mERROR\033[0m %s\n", time.Now().Format("15:04:05"), msg)
		return goja.Undefined()
	})

	logModule.Set("debug", func(args ...goja.Value) goja.Value {
		msg := formatArgs(vm, args)
		fmt.Printf("%s \033[35mDEBUG\033[0m %s\n", time.Now().Format("15:04:05"), msg)
		return goja.Undefined()
	})

	logModule.Set("success", func(args ...goja.Value) goja.Value {
		msg := formatArgs(vm, args)
		fmt.Printf("%s \033[32mOK\033[0m %s\n", time.Now().Format("15:04:05"), msg)
		return goja.Undefined()
	})

	logModule.Set("print", func(args ...goja.Value) goja.Value {
		msg := formatArgs(vm, args)
		fmt.Println(msg)
		return goja.Undefined()
	})

	vm.Set("log", logModule)
}

func formatArgs(vm *goja.Runtime, args []goja.Value) string {
	var parts []string
	for _, arg := range args {
		parts = append(parts, formatValue(vm, arg))
	}
	result := ""
	for i, p := range parts {
		if i > 0 {
			result += " "
		}
		result += p
	}
	return result
}
