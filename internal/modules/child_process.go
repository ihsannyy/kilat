package modules

import (
	"bytes"
	"io"
	"os"
	"os/exec"
	"runtime"

	"github.com/dop251/goja"
)

func RegisterChildProcess(vm *goja.Runtime, queueJob func(func()), incrementTasks func(), decrementTasks func()) {
	cpModule := vm.NewObject()

	cpModule.Set("execSync", func(command string) map[string]interface{} {
		var shell, flag string
		if os.Getenv("SHELL") != "" {
			shell = os.Getenv("SHELL")
			flag = "-c"
		} else if runtime.GOOS == "windows" {
			shell = "cmd.exe"
			flag = "/c"
		} else {
			shell = "sh"
			flag = "-c"
		}

		cmd := exec.Command(shell, flag, command)
		var stdout, stderr bytes.Buffer
		cmd.Stdout = &stdout
		cmd.Stderr = &stderr

		err := cmd.Run()

		exitCode := 0
		if err != nil {
			if exitError, ok := err.(*exec.ExitError); ok {
				exitCode = exitError.ExitCode()
			} else {
				exitCode = -1
			}
		}

		return map[string]interface{}{
			"stdout":   stdout.String(),
			"stderr":   stderr.String(),
			"exitCode": exitCode,
		}
	})

	cpModule.Set("exec", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(vm.ToValue("exec requires at least 1 argument"))
		}
		command := call.Arguments[0].String()

		var callback goja.Value
		if len(call.Arguments) > 1 && !goja.IsUndefined(call.Arguments[1]) && !goja.IsNull(call.Arguments[1]) {
			callback = call.Arguments[1]
		}

		cb, ok := goja.AssertFunction(callback)
		if !ok {
			panic(vm.ToValue("exec callback must be a function"))
		}

		incrementTasks()

		go func() {
			var shell, flag string
			if os.Getenv("SHELL") != "" {
				shell = os.Getenv("SHELL")
				flag = "-c"
			} else if runtime.GOOS == "windows" {
				shell = "cmd.exe"
				flag = "/c"
			} else {
				shell = "sh"
				flag = "-c"
			}

			cmd := exec.Command(shell, flag, command)
			var stdout, stderr bytes.Buffer
			cmd.Stdout = &stdout
			cmd.Stderr = &stderr

			err := cmd.Run()

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
				resultObj := vm.NewObject()
				resultObj.Set("stdout", stdout.String())
				resultObj.Set("stderr", stderr.String())
				resultObj.Set("exitCode", exitCode)

				if errStr != "" && exitCode == -1 {
					cb(goja.Undefined(), vm.ToValue(errStr), resultObj)
				} else {
					cb(goja.Undefined(), goja.Null(), resultObj)
				}
			})
		}()

		return goja.Undefined()
	})

	cpModule.Set("spawn", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(vm.ToValue("spawn requires at least 1 argument"))
		}
		command := call.Arguments[0].String()

		var args []string
		if len(call.Arguments) > 1 && !goja.IsUndefined(call.Arguments[1]) && !goja.IsNull(call.Arguments[1]) {
			argsVal := call.Arguments[1]
			if argsArr, ok := argsVal.Export().([]interface{}); ok {
				for _, v := range argsArr {
					args = append(args, v.(goja.Value).String())
				}
			}
		}

		incrementTasks()

		cmd := exec.Command(command, args...)
		stdoutPipe, err := cmd.StdoutPipe()
		if err != nil {
			decrementTasks()
			panic(vm.NewGoError(err))
		}
		stderrPipe, err := cmd.StderrPipe()
		if err != nil {
			decrementTasks()
			panic(vm.NewGoError(err))
		}

		processObj := vm.NewObject()
		processObj.Set("pid", 0)

		onCallbacks := make(map[string][]goja.Value)

		processObj.Set("on", func(event string, callback goja.Value) goja.Value {
			onCallbacks[event] = append(onCallbacks[event], callback)
			return processObj
		})

		processObj.Set("kill", func() {
			if cmd.Process != nil {
				cmd.Process.Kill()
			}
		})

		if err := cmd.Start(); err != nil {
			decrementTasks()
			panic(vm.NewGoError(err))
		}

		processObj.Set("pid", cmd.Process.Pid)

		go func() {
			buf := make([]byte, 4096)
			for {
				n, err := stdoutPipe.Read(buf)
				if n > 0 {
					data := string(buf[:n])
					queueJob(func() {
						for _, cb := range onCallbacks["data"] {
							if fn, ok := goja.AssertFunction(cb); ok {
								fn(goja.Undefined(), vm.ToValue(data))
							}
						}
					})
				}
				if err != nil {
					break
				}
			}
		}()

		go func() {
			buf := make([]byte, 4096)
			for {
				n, err := stderrPipe.Read(buf)
				if n > 0 {
					data := string(buf[:n])
					queueJob(func() {
						for _, cb := range onCallbacks["data"] {
							if fn, ok := goja.AssertFunction(cb); ok {
								fn(goja.Undefined(), vm.ToValue(data))
							}
						}
					})
				}
				if err != nil {
					break
				}
			}
		}()

		go func() {
			err := cmd.Wait()
			exitCode := 0
			if err != nil {
				if exitError, ok := err.(*exec.ExitError); ok {
					exitCode = exitError.ExitCode()
				}
			}
			queueJob(func() {
				defer decrementTasks()
				for _, cb := range onCallbacks["close"] {
					if fn, ok := goja.AssertFunction(cb); ok {
						fn(goja.Undefined(), vm.ToValue(exitCode))
					}
				}
				if err != nil {
					for _, cb := range onCallbacks["error"] {
						if fn, ok := goja.AssertFunction(cb); ok {
							fn(goja.Undefined(), vm.ToValue(err.Error()))
						}
					}
				}
			})
		}()

		return processObj
	})

	cpModule.Set("execFile", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(vm.ToValue("execFile requires at least 1 argument"))
		}
		file := call.Arguments[0].String()

		var args []string
		if len(call.Arguments) > 1 && !goja.IsUndefined(call.Arguments[1]) && !goja.IsNull(call.Arguments[1]) {
			if argsArr, ok := call.Arguments[1].Export().([]interface{}); ok {
				for _, v := range argsArr {
					args = append(args, v.(goja.Value).String())
				}
			}
		}

		var callback goja.Value
		for i := 2; i < len(call.Arguments); i++ {
			if !goja.IsUndefined(call.Arguments[i]) && !goja.IsNull(call.Arguments[i]) {
				callback = call.Arguments[i]
				break
			}
		}

		cb, _ := goja.AssertFunction(callback)
		incrementTasks()

		go func() {
			cmd := exec.Command(file, args...)
			var stdout, stderr bytes.Buffer
			cmd.Stdout = &stdout
			cmd.Stderr = &stderr

			err := cmd.Run()
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
				if cb != nil {
					resultObj := vm.NewObject()
					resultObj.Set("stdout", stdout.String())
					resultObj.Set("stderr", stderr.String())
					resultObj.Set("exitCode", exitCode)
					if errStr != "" && exitCode == -1 {
						cb(goja.Undefined(), vm.ToValue(errStr), resultObj)
					} else {
						cb(goja.Undefined(), goja.Null(), resultObj)
					}
				}
			})
		}()

		return goja.Undefined()
	})

	vm.Set("child_process", cpModule)

	_ = io.EOF
}
