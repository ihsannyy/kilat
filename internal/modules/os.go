package modules

import (
	"bytes"
	"github.com/dop251/goja"
	"os"
	"os/exec"
)

func RegisterOS(vm *goja.Runtime, queueJob func(func()), incrementTasks func(), decrementTasks func()) {
	osModule := vm.NewObject()
	osModule.Set("getenv", func(key string) string {
		return os.Getenv(key)
	})
	osModule.Set("args", func() []string {
		return os.Args[1:]
	})
	vm.Set("os", osModule)

	vm.Set("__nativeExec", func(cmd string, callback goja.Value) goja.Value {
		cb, ok := goja.AssertFunction(callback)
		if !ok {
			panic(vm.ToValue("callback must be a function"))
		}

		incrementTasks()

		go func() {
			var shell, flag string
			if os.Getenv("SHELL") != "" {
				shell = os.Getenv("SHELL")
				flag = "-c"
			} else {
				shell = "sh"
				flag = "-c"
			}

			execCmd := exec.Command(shell, flag, cmd)
			var stdout, stderr bytes.Buffer
			execCmd.Stdout = &stdout
			execCmd.Stderr = &stderr
			err := execCmd.Run()

			exitCode := 0
			var errStr string
			if err != nil {
				if exitError, ok := err.(*exec.ExitError); ok {
					exitCode = exitError.ExitCode()
				} else {
					exitCode = -1
				}
				errStr = err.Error()
			}

			queueJob(func() {
				defer decrementTasks()
				if errStr != "" && exitCode == -1 {
					cb(goja.Undefined(), vm.ToValue(errStr), goja.Undefined(), goja.Undefined(), vm.ToValue(exitCode))
				} else {
					cb(goja.Undefined(), goja.Null(), vm.ToValue(stdout.String()), vm.ToValue(stderr.String()), vm.ToValue(exitCode))
				}
			})
		}()
		return goja.Undefined()
	})
}
