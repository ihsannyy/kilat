package modules

import (
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"github.com/dop251/goja"
)

type responseData struct {
	Status  int
	Headers map[string]string
	Body    []byte
	Error   error
}

func RegisterBun(vm *goja.Runtime, queueJob func(func()), setHasServer func(bool)) {
	bun := vm.NewObject()
	
	bun.Set("serve", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(vm.ToValue("Bun.serve expects 1 argument"))
		}
		optsVal := call.Arguments[0]
		opts := optsVal.ToObject(vm)

		port := 3000
		if pVal := opts.Get("port"); pVal != nil && !goja.IsUndefined(pVal) && !goja.IsNull(pVal) {
			port = int(pVal.ToInteger())
		}

		hostname := "0.0.0.0"
		if hVal := opts.Get("hostname"); hVal != nil && !goja.IsUndefined(hVal) && !goja.IsNull(hVal) {
			hostname = hVal.String()
		}

		fetchVal := opts.Get("fetch")
		if fetchVal == nil || goja.IsUndefined(fetchVal) {
			panic(vm.ToValue("options.fetch is required"))
		}
		_, ok := goja.AssertFunction(fetchVal)
		if !ok {
			panic(vm.ToValue("options.fetch must be a function"))
		}

		listener, err := net.Listen("tcp", fmt.Sprintf("%s:%d", hostname, port))
		if err != nil {
			panic(vm.NewGoError(err))
		}
		actualPort := listener.Addr().(*net.TCPAddr).Port

		setHasServer(true)

		server := &http.Server{
			Handler: http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
				bodyBytes, _ := ioutil.ReadAll(req.Body)
				reqBody := string(bodyBytes)

				headersMap := make(map[string]string)
				for name, values := range req.Header {
					if len(values) > 0 {
						headersMap[name] = values[0]
					}
				}

				respChan := make(chan responseData, 1)

				queueJob(func() {
					reqConstructor := vm.Get("Request")
					optionsObj := vm.NewObject()
					optionsObj.Set("method", req.Method)
					optionsObj.Set("body", reqBody)

					headersObj := vm.NewObject()
					for k, v := range headersMap {
						headersObj.Set(k, v)
					}
					optionsObj.Set("headers", headersObj)

					scheme := "http"
					if req.TLS != nil {
						scheme = "https"
					}
					fullURL := fmt.Sprintf("%s://%s%s", scheme, req.Host, req.URL.String())

					jsReq, err := vm.New(reqConstructor, vm.ToValue(fullURL), optionsObj)
					if err != nil {
						respChan <- responseData{Error: err}
						return
					}

					handleReqVal := vm.Get("__handleRequest")
					handleReq, _ := goja.AssertFunction(handleReqVal)

					callback := func(call goja.FunctionCall) goja.Value {
						errVal := call.Arguments[0]
						resVal := call.Arguments[1]

						if errVal != nil && !goja.IsNull(errVal) && !goja.IsUndefined(errVal) {
							respChan <- responseData{
								Error: fmt.Errorf("%v", errVal),
							}
							return goja.Undefined()
						}

						if resVal == nil || goja.IsNull(resVal) || goja.IsUndefined(resVal) {
							respChan <- responseData{
								Status: 200,
								Body:   []byte(""),
							}
							return goja.Undefined()
						}

						resObj := resVal.ToObject(vm)
						status := int(resObj.Get("status").ToInteger())
						if status == 0 {
							status = 200
						}

						bodyVal := resObj.Get("_body")
						var bodyBytes []byte
						if bodyVal != nil {
							bodyBytes = []byte(bodyVal.String())
						}

						resHeaders := make(map[string]string)
						headersObjVal := resObj.Get("headers")
						if headersObjVal != nil && !goja.IsUndefined(headersObjVal) && !goja.IsNull(headersObjVal) {
							headersObj := headersObjVal.ToObject(vm)
							internalHeadersVal := headersObj.Get("_headers")
							if internalHeadersVal != nil && !goja.IsUndefined(internalHeadersVal) && !goja.IsNull(internalHeadersVal) {
								internalHeadersObj := internalHeadersVal.ToObject(vm)
								for _, key := range internalHeadersObj.Keys() {
									resHeaders[key] = internalHeadersObj.Get(key).String()
								}
							}
						}

						respChan <- responseData{
							Status:  status,
							Headers: resHeaders,
							Body:    bodyBytes,
						}
						return goja.Undefined()
					}

					_, err = handleReq(goja.Undefined(), fetchVal, jsReq, vm.ToValue(callback))
					if err != nil {
						respChan <- responseData{Error: err}
					}
				})

				res := <-respChan
				if res.Error != nil {
					w.WriteHeader(500)
					w.Write([]byte(fmt.Sprintf("Internal Server Error: %v", res.Error)))
					return
				}

				for k, v := range res.Headers {
					w.Header().Set(k, v)
				}
				w.WriteHeader(res.Status)
				w.Write(res.Body)
			}),
		}

		go func() {
			server.Serve(listener)
		}()

		serverObj := vm.NewObject()
		serverObj.Set("port", actualPort)
		serverObj.Set("hostname", hostname)
		serverObj.Set("stop", func() {
			listener.Close()
			setHasServer(false)
		})

		return serverObj
	})

	vm.Set("Bun", bun)
}
