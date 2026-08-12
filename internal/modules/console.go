package modules

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/dop251/goja"
	"github.com/fatih/color"
)

func formatArg(v interface{}) string {
	if v == nil {
		return "null"
	}
	switch val := v.(type) {
	case string:
		return val
	case fmt.Stringer:
		return val.String()
	case map[string]interface{}, []interface{}:
		bytes, err := json.Marshal(val)
		if err == nil {
			return string(bytes)
		}
		return fmt.Sprintf("%v", val)
	default:
		return fmt.Sprintf("%v", val)
	}
}

func printArgs(prefix string, args []interface{}) {
	parts := make([]string, len(args))
	for i, arg := range args {
		parts[i] = formatArg(arg)
	}
	if prefix != "" {
		fmt.Print(prefix)
	}
	fmt.Println(strings.Join(parts, " "))
}

func RegisterConsole(vm *goja.Runtime) {
	console := vm.NewObject()

	console.Set("log", func(args ...interface{}) {
		printArgs("", args)
	})

	console.Set("error", func(args ...interface{}) {
		red := color.New(color.FgRed)
		printArgs(red.Sprint("❌ "), args)
	})

	console.Set("warn", func(args ...interface{}) {
		yellow := color.New(color.FgYellow)
		printArgs(yellow.Sprint("⚠️ "), args)
	})

	vm.Set("console", console)
}
