package modules

import (
	"fmt"
	"github.com/dop251/goja"
	"github.com/fatih/color"
)

func RegisterConsole(vm *goja.Runtime) {
	console := vm.NewObject()

	console.Set("log", func(args ...interface{}) {
		fmt.Println(args...)
	})

	console.Set("error", func(args ...interface{}) {
		red := color.New(color.FgRed)
		red.Print("❌ ")
		fmt.Println(args...)
	})

	console.Set("warn", func(args ...interface{}) {
		yellow := color.New(color.FgYellow)
		yellow.Print("⚠️ ")
		fmt.Println(args...)
	})

	vm.Set("console", console)
}
