package modules

import (
	"fmt"

	"github.com/dop251/goja"
)

func throwTypeError(vm *goja.Runtime, msg string) {
	panic(vm.NewGoError(fmt.Errorf("%s", msg)))
}

func throwTypeErrorf(vm *goja.Runtime, format string, args ...interface{}) {
	panic(vm.NewGoError(fmt.Errorf(format, args...)))
}

func formatValue(vm *goja.Runtime, val goja.Value) string {
	if val == nil || goja.IsUndefined(val) || goja.IsNull(val) {
		return "<nil>"
	}
	if obj := val.ToObject(vm); obj != nil {
		jsonStr, err := vm.RunString("JSON.stringify(" + vm.ToValue(obj).String() + ")")
		if err == nil {
			return jsonStr.String()
		}
	}
	return val.String()
}
