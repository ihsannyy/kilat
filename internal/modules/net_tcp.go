package modules

import (
	"bufio"
	"fmt"
	"net"
	"sync"

	"github.com/dop251/goja"
)

func RegisterNetTCP(vm *goja.Runtime, queueJob func(func()), incrementTasks func(), decrementTasks func()) {
	netModule := vm.Get("net").ToObject(vm)

	netModule.Set("createConnection", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(vm.ToValue("net.createConnection requires at least 1 argument"))
		}

		var host string
		var port int

		optsVal := call.Arguments[0]
		if optsObj, ok := optsVal.Export().(map[string]interface{}); ok {
			if hVal, ok := optsObj["host"].(string); ok {
				host = hVal
			}
			if pVal, ok := optsObj["port"]; ok {
				port = int(pVal.(float64))
			}
		} else {
			host = optsVal.String()
			if len(call.Arguments) > 1 {
				port = int(call.Arguments[1].ToInteger())
			}
		}

		var callback goja.Value
		if len(call.Arguments) > 1 && !goja.IsUndefined(call.Arguments[len(call.Arguments)-1]) {
			last := call.Arguments[len(call.Arguments)-1]
			if _, ok := goja.AssertFunction(last); ok {
				callback = last
			}
		}
		cb, _ := goja.AssertFunction(callback)

		socketObj := vm.NewObject()
		var conn net.Conn
		var mu sync.Mutex
		var connected bool

		socketObj.Set("connect", func() goja.Value {
			incrementTasks()

			go func() {
				var err error
				conn, err = net.Dial("tcp", net.JoinHostPort(host, fmt.Sprintf("%d", port)))
				if err != nil {
					queueJob(func() {
						defer decrementTasks()
						queueJob(func() {
							socketObj.Set("destroyed", true)
							onErr := socketObj.Get("onerror")
							if onErr != nil && !goja.IsUndefined(onErr) && !goja.IsNull(onErr) {
								if cb, ok := goja.AssertFunction(onErr); ok {
									cb(vm.ToValue(err.Error()))
								}
							}
						})
					})
					return
				}

				mu.Lock()
				connected = true
				socketObj.Set("destroyed", false)
				mu.Unlock()

				if cb != nil {
					queueJob(func() {
						cb(goja.Null())
					})
				}

				onConnect := socketObj.Get("onconnect")
				if onConnect != nil && !goja.IsUndefined(onConnect) && !goja.IsNull(onConnect) {
					if connectCb, ok := goja.AssertFunction(onConnect); ok {
						queueJob(func() {
							connectCb(goja.Null())
						})
					}
				}

				scanner := bufio.NewScanner(conn)
				for scanner.Scan() {
					data := scanner.Text()
					queueJob(func() {
						onData := socketObj.Get("ondata")
						if onData != nil && !goja.IsUndefined(onData) && !goja.IsNull(onData) {
							if dataCb, ok := goja.AssertFunction(onData); ok {
								dataCb(vm.ToValue(data))
							}
						}
					})
				}

				mu.Lock()
				connected = false
				mu.Unlock()

				queueJob(func() {
					defer decrementTasks()
					socketObj.Set("destroyed", true)
					onEnd := socketObj.Get("onend")
					if onEnd != nil && !goja.IsUndefined(onEnd) && !goja.IsNull(onEnd) {
						if endCb, ok := goja.AssertFunction(onEnd); ok {
							endCb(goja.Null())
						}
					}
				})
			}()

			return socketObj
		})

		socketObj.Set("write", func(data string) goja.Value {
			mu.Lock()
			defer mu.Unlock()
			if conn == nil || !connected {
				return vm.ToValue(false)
			}
			_, err := conn.Write([]byte(data + "\n"))
			if err != nil {
				return vm.ToValue(false)
			}
			return vm.ToValue(true)
		})

		socketObj.Set("end", func(data ...goja.Value) goja.Value {
			mu.Lock()
			defer mu.Unlock()
			if conn != nil && connected {
				if len(data) > 0 {
					conn.Write([]byte(data[0].String()))
				}
				conn.Close()
				connected = false
			}
			return goja.Undefined()
		})

		socketObj.Set("destroy", func() goja.Value {
			mu.Lock()
			defer mu.Unlock()
			if conn != nil {
				conn.Close()
				connected = false
			}
			socketObj.Set("destroyed", true)
			return goja.Undefined()
		})

		socketObj.Set("on", func(event string, callback goja.Value) goja.Value {
			switch event {
			case "connect":
				socketObj.Set("onconnect", callback)
			case "data":
				socketObj.Set("ondata", callback)
			case "end":
				socketObj.Set("onend", callback)
			case "error":
				socketObj.Set("onerror", callback)
			case "close":
				socketObj.Set("onclose", callback)
			}
			return socketObj
		})

		socketObj.Set("once", func(event string, callback goja.Value) goja.Value {
			onFn := socketObj.Get("on")
			if onFn != nil && !goja.IsUndefined(onFn) && !goja.IsNull(onFn) {
				if cb, ok := goja.AssertFunction(onFn); ok {
					cb(socketObj, vm.ToValue(event), callback)
				}
			}
			return socketObj
		})

		socketObj.Set("removeListener", func(event string, callback goja.Value) goja.Value {
			return socketObj
		})

		socketObj.Set("address", func() goja.Value {
			if conn != nil {
				addr := conn.RemoteAddr().(*net.TCPAddr)
				obj := vm.NewObject()
				obj.Set("address", addr.IP.String())
				obj.Set("port", addr.Port)
				obj.Set("family", "IPv4")
				return obj
			}
			return goja.Null()
		})

		socketObj.Set("remoteAddress", "")
		socketObj.Set("remotePort", 0)
		socketObj.Set("destroyed", false)
		socketObj.Set("bufferSize", 0)
		socketObj.Set("pending", true)

		return socketObj
	})

	netModule.Set("createServer", func(call goja.FunctionCall) goja.Value {
		var callback goja.Value
		if len(call.Arguments) > 0 && !goja.IsUndefined(call.Arguments[0]) {
			callback = call.Arguments[0]
		}
		handlerFn, _ := goja.AssertFunction(callback)

		serverObj := vm.NewObject()
		var listener net.Listener
		var mu sync.Mutex
		var connections []net.Conn

		serverObj.Set("listen", func(call goja.FunctionCall) goja.Value {
			port := 3000
			if len(call.Arguments) > 0 {
				port = int(call.Arguments[0].ToInteger())
			}

			host := "0.0.0.0"
			if len(call.Arguments) > 1 && !goja.IsUndefined(call.Arguments[1]) && !goja.IsNull(call.Arguments[1]) {
				if opts, ok := call.Arguments[1].Export().(map[string]interface{}); ok {
					if h, ok := opts["host"].(string); ok {
						host = h
					}
				}
			}

			var err error
			listener, err = net.Listen("tcp", net.JoinHostPort(host, fmt.Sprintf("%d", port)))
			if err != nil {
				panic(vm.NewGoError(err))
			}

			go func() {
				for {
					conn, err := listener.Accept()
					if err != nil {
						return
					}

					mu.Lock()
					connections = append(connections, conn)
					mu.Unlock()

					socketObj := vm.NewObject()
					var connMu sync.Mutex

					reader := bufio.NewReader(conn)

					socketObj.Set("remoteAddress", conn.RemoteAddr().String())

				socketObj.Set("write", func(data string) goja.Value {
					connMu.Lock()
					defer connMu.Unlock()
					_, err := conn.Write([]byte(data + "\n"))
					return vm.ToValue(err == nil)
				})

					socketObj.Set("end", func(data ...goja.Value) goja.Value {
						connMu.Lock()
						defer connMu.Unlock()
						if len(data) > 0 {
							conn.Write([]byte(data[0].String()))
						}
						conn.Close()
						return goja.Undefined()
					})

					socketObj.Set("destroy", func() goja.Value {
						connMu.Lock()
						defer connMu.Unlock()
						conn.Close()
						return goja.Undefined()
					})

					socketObj.Set("on", func(event string, cb goja.Value) goja.Value {
						switch event {
						case "data":
							socketObj.Set("ondata", cb)
						case "end":
							socketObj.Set("onend", cb)
						case "error":
							socketObj.Set("onerror", cb)
						}
						return socketObj
					})

					go func() {
						scanner := bufio.NewScanner(reader)
						for scanner.Scan() {
							data := scanner.Text()
							queueJob(func() {
								onData := socketObj.Get("ondata")
								if onData != nil && !goja.IsUndefined(onData) && !goja.IsNull(onData) {
									if cb, ok := goja.AssertFunction(onData); ok {
										cb(vm.ToValue(data))
									}
								}
							})
						}
						queueJob(func() {
							onEnd := socketObj.Get("onend")
							if onEnd != nil && !goja.IsUndefined(onEnd) && !goja.IsNull(onEnd) {
								if cb, ok := goja.AssertFunction(onEnd); ok {
									cb(goja.Null())
								}
							}
						})
					}()

					if handlerFn != nil {
						queueJob(func() {
							handlerFn(goja.Undefined(), socketObj)
						})
					}
				}
			}()

			return serverObj
		})

		serverObj.Set("close", func(call goja.FunctionCall) goja.Value {
			if listener != nil {
				listener.Close()
			}
			mu.Lock()
			for _, conn := range connections {
				conn.Close()
			}
			connections = nil
			mu.Unlock()
			return goja.Undefined()
		})

		serverObj.Set("on", func(event string, callback goja.Value) goja.Value {
			return serverObj
		})

		return serverObj
	})
}
