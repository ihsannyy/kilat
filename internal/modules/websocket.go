package modules

import (
	"fmt"
	"sync"
	"time"

	"github.com/dop251/goja"
	"github.com/gorilla/websocket"
)

func RegisterWebSocket(vm *goja.Runtime, queueJob func(func()), incrementTasks func(), decrementTasks func()) {
	wsConstructor := func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(vm.ToValue("WebSocket requires 1 argument"))
		}
		url := call.Arguments[0].String()

		var protocols []string
		if len(call.Arguments) > 1 && !goja.IsUndefined(call.Arguments[1]) && !goja.IsNull(call.Arguments[1]) {
			switch v := call.Arguments[1].Export().(type) {
			case string:
				protocols = []string{v}
			case []interface{}:
				for _, p := range v {
					protocols = append(protocols, fmt.Sprintf("%v", p))
				}
			}
		}
		_ = protocols

		dialer := websocket.Dialer{
			HandshakeTimeout: 10 * time.Second,
		}

		conn, _, err := dialer.Dial(url, nil)
		if err != nil {
			wsObj := vm.NewObject()
			wsObj.Set("readyState", 3)
			wsObj.Set("url", url)
			wsObj.Set("protocol", "")
			wsObj.Set("bufferedAmount", 0)
			wsObj.Set("extensions", "")
			wsObj.Set("binaryType", "blob")

			onErr := wsObj.Get("onerror")
			if onErr != nil && !goja.IsUndefined(onErr) && !goja.IsNull(onErr) {
				if cb, ok := goja.AssertFunction(onErr); ok {
					eventObj := vm.NewObject()
					eventObj.Set("message", err.Error())
					eventObj.Set("type", "error")
					cb(goja.Undefined(), eventObj)
				}
			}
			return wsObj
		}

		wsObj := vm.NewObject()
		wsObj.Set("readyState", 1)
		wsObj.Set("url", url)
		wsObj.Set("protocol", "")
		wsObj.Set("bufferedAmount", 0)
		wsObj.Set("extensions", "")
		wsObj.Set("binaryType", "blob")

		var mu sync.Mutex

		wsObj.Set("send", func(data goja.Value) goja.Value {
			mu.Lock()
			defer mu.Unlock()
			if conn == nil {
				return vm.ToValue(fmt.Errorf("WebSocket is not connected"))
			}
			err := conn.WriteMessage(websocket.TextMessage, []byte(data.String()))
			if err != nil {
				return vm.ToValue(err)
			}
			return goja.Null()
		})

		wsObj.Set("close", func(args ...goja.Value) goja.Value {
			mu.Lock()
			defer mu.Unlock()
			if conn != nil {
				code := websocket.CloseNormalClosure
				reason := ""
				if len(args) > 0 && !goja.IsUndefined(args[0]) && !goja.IsNull(args[0]) {
					code = int(args[0].ToInteger())
				}
				if len(args) > 1 && !goja.IsUndefined(args[1]) && !goja.IsNull(args[1]) {
					reason = args[1].String()
				}
				conn.WriteMessage(websocket.CloseMessage,
					websocket.FormatCloseMessage(code, reason))
				conn.Close()
				conn = nil
				wsObj.Set("readyState", 3)
			}
			return goja.Null()
		})

		wsObj.Set("addEventListener", func(event string, callback goja.Value) goja.Value {
			wsObj.Set("on"+event, callback)
			return wsObj
		})

		wsObj.Set("removeEventListener", func(event string, callback goja.Value) goja.Value {
			wsObj.Set("on"+event, goja.Null())
			return wsObj
		})

		incrementTasks()

		go func() {
			defer decrementTasks()
			for {
				mu.Lock()
				if conn == nil {
					mu.Unlock()
					return
				}
				mu.Unlock()

				messageType, message, err := conn.ReadMessage()
				if err != nil {
					mu.Lock()
					wsObj.Set("readyState", 3)
					conn = nil
					mu.Unlock()

					queueJob(func() {
						onClose := wsObj.Get("onclose")
						if onClose != nil && !goja.IsUndefined(onClose) && !goja.IsNull(onClose) {
							if cb, ok := goja.AssertFunction(onClose); ok {
								eventObj := vm.NewObject()
								eventObj.Set("type", "close")
								eventObj.Set("code", 1006)
								eventObj.Set("reason", err.Error())
								eventObj.Set("wasClean", false)
								cb(goja.Undefined(), eventObj)
							}
						}
					})
					return
				}

				msgType := "text"
				if messageType == websocket.BinaryMessage {
					msgType = "binary"
				}

				queueJob(func() {
					onMessage := wsObj.Get("onmessage")
					if onMessage != nil && !goja.IsUndefined(onMessage) && !goja.IsNull(onMessage) {
						if cb, ok := goja.AssertFunction(onMessage); ok {
							eventObj := vm.NewObject()
							eventObj.Set("type", "message")
							eventObj.Set("data", string(message))
							eventObj.Set("origin", url)
							eventObj.Set("lastEventId", "")
							eventObj.Set("source", goja.Null())
							eventObj.Set("messageType", msgType)
							cb(goja.Undefined(), eventObj)
						}
					}
				})
			}
		}()

		queueJob(func() {
			onOpen := wsObj.Get("onopen")
			if onOpen != nil && !goja.IsUndefined(onOpen) && !goja.IsNull(onOpen) {
				if cb, ok := goja.AssertFunction(onOpen); ok {
					eventObj := vm.NewObject()
					eventObj.Set("type", "open")
					cb(goja.Undefined(), eventObj)
				}
			}
		})

		return wsObj
	}

	vm.Set("WebSocket", wsConstructor)
}
