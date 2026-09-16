package modules

import (
	"crypto/tls"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/dop251/goja"
)

func RegisterHTTPS(vm *goja.Runtime, queueJob func(func()), incrementTasks func(), decrementTasks func()) {
	httpsModule := vm.NewObject()

	httpsModule.Set("request", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(vm.ToValue("https.request requires at least 1 argument"))
		}

		var url string
		var method string = "GET"
		var headers map[string]string
		var body string
		var callback goja.Value

		optsVal := call.Arguments[0]
		if optsVal != nil && !goja.IsUndefined(optsVal) && !goja.IsNull(optsVal) {
			if optsObj, ok := optsVal.Export().(map[string]interface{}); ok {
				if uVal, ok := optsObj["url"].(string); ok {
					url = uVal
				} else if hVal, ok := optsObj["hostname"].(string); ok {
					port := "443"
					if pVal, ok := optsObj["port"]; ok {
						port = fmt.Sprintf("%v", pVal)
					}
					path := "/"
					if paVal, ok := optsObj["path"].(string); ok {
						path = paVal
					}
					url = fmt.Sprintf("https://%s:%s%s", hVal, port, path)
				}
				if mVal, ok := optsObj["method"].(string); ok {
					method = mVal
				}
				if bVal, ok := optsObj["body"].(string); ok {
					body = bVal
				}
				if hdVal, ok := optsObj["headers"].(map[string]interface{}); ok {
					headers = make(map[string]string)
					for k, v := range hdVal {
						headers[k] = fmt.Sprintf("%v", v)
					}
				}
			} else {
				url = optsVal.String()
			}
		}

		if len(call.Arguments) > 1 && !goja.IsUndefined(call.Arguments[1]) {
			callback = call.Arguments[1]
		}
		cb, _ := goja.AssertFunction(callback)

		incrementTasks()

		go func() {
			tr := &http.Transport{
				TLSClientConfig: &tls.Config{
					InsecureSkipVerify: false,
				},
			}
			client := &http.Client{
				Transport: tr,
				Timeout:   30 * time.Second,
			}

			req, err := http.NewRequest(method, url, strings.NewReader(body))
			if err != nil {
				queueJob(func() {
					defer decrementTasks()
					if cb != nil {
						cb(vm.ToValue(err.Error()), goja.Null())
					}
				})
				return
			}
			for k, v := range headers {
				req.Header.Set(k, v)
			}

			resp, err := client.Do(req)
			if err != nil {
				queueJob(func() {
					defer decrementTasks()
					if cb != nil {
						cb(vm.ToValue(err.Error()), goja.Null())
					}
				})
				return
			}
			defer resp.Body.Close()

			respBody, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				queueJob(func() {
					defer decrementTasks()
					if cb != nil {
						cb(vm.ToValue(err.Error()), goja.Null())
					}
				})
				return
			}

			queueJob(func() {
				defer decrementTasks()
				resObj := vm.NewObject()
				resObj.Set("statusCode", resp.StatusCode)
				resObj.Set("body", string(respBody))

				resHeadersObj := vm.NewObject()
				for k, v := range resp.Header {
					if len(v) > 0 {
						resHeadersObj.Set(k, v[0])
					}
				}
				resObj.Set("headers", resHeadersObj)

				resObj.Set("on", func(event string, callback goja.Value) goja.Value {
					return resObj
				})

				resObj.Set("setEncoding", func(enc string) goja.Value {
					return resObj
				})

				if cb != nil {
					cb(goja.Null(), resObj)
				}
			})
		}()

		reqObj := vm.NewObject()
		reqObj.Set("write", func(data string) goja.Value {
			body += data
			return vm.ToValue(true)
		})
		reqObj.Set("end", func(data ...goja.Value) goja.Value {
			if len(data) > 0 {
				body += data[0].String()
			}
			return goja.Undefined()
		})
		reqObj.Set("on", func(event string, callback goja.Value) goja.Value {
			return reqObj
		})

		return reqObj
	})

	httpsModule.Set("get", func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(vm.ToValue("https.get requires at least 1 argument"))
		}

		url := call.Arguments[0].String()
		var callback goja.Value
		if len(call.Arguments) > 1 {
			callback = call.Arguments[1]
		}
		cb, _ := goja.AssertFunction(callback)

		incrementTasks()

		go func() {
			tr := &http.Transport{
				TLSClientConfig: &tls.Config{
					InsecureSkipVerify: false,
				},
			}
			client := &http.Client{
				Transport: tr,
				Timeout:   30 * time.Second,
			}

			resp, err := client.Get(url)
			if err != nil {
				queueJob(func() {
					defer decrementTasks()
					if cb != nil {
						cb(vm.ToValue(err.Error()), goja.Null())
					}
				})
				return
			}
			defer resp.Body.Close()

			respBody, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				queueJob(func() {
					defer decrementTasks()
					if cb != nil {
						cb(vm.ToValue(err.Error()), goja.Null())
					}
				})
				return
			}

			queueJob(func() {
				defer decrementTasks()
				resObj := vm.NewObject()
				resObj.Set("statusCode", resp.StatusCode)
				resObj.Set("body", string(respBody))

				resHeadersObj := vm.NewObject()
				for k, v := range resp.Header {
					if len(v) > 0 {
						resHeadersObj.Set(k, v[0])
					}
				}
				resObj.Set("headers", resHeadersObj)

				resObj.Set("on", func(event string, callback goja.Value) goja.Value {
					return resObj
				})

				resObj.Set("setEncoding", func(enc string) goja.Value {
					return resObj
				})

				if cb != nil {
					cb(goja.Null(), resObj)
				}
			})
		}()

		return goja.Undefined()
	})

	httpsModule.Set("createServer", func(call goja.FunctionCall) goja.Value {
		var handler goja.Value
		if len(call.Arguments) > 0 && !goja.IsUndefined(call.Arguments[0]) && !goja.IsNull(call.Arguments[0]) {
			handler = call.Arguments[0]
		}

		handlerFn, _ := goja.AssertFunction(handler)

		serverObj := vm.NewObject()
		var server *http.Server

		serverObj.Set("listen", func(call goja.FunctionCall) goja.Value {
			port := 443
			if len(call.Arguments) > 0 && !goja.IsUndefined(call.Arguments[0]) && !goja.IsNull(call.Arguments[0]) {
				port = int(call.Arguments[0].ToInteger())
			}

			host := "0.0.0.0"
			var certFile, keyFile string
			if len(call.Arguments) > 1 && !goja.IsUndefined(call.Arguments[1]) && !goja.IsNull(call.Arguments[1]) {
				opts := call.Arguments[1].ToObject(vm)
				if hVal := opts.Get("host"); hVal != nil && !goja.IsUndefined(hVal) {
					host = hVal.String()
				}
				if cVal := opts.Get("cert"); cVal != nil && !goja.IsUndefined(cVal) {
					certFile = cVal.String()
				}
				if kVal := opts.Get("key"); kVal != nil && !goja.IsUndefined(kVal) {
					keyFile = kVal.String()
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

			mux := http.NewServeMux()
			mux.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
				bodyBytes, _ := ioutil.ReadAll(req.Body)
				reqBody := string(bodyBytes)

				headersMap := make(map[string]string)
				for name, values := range req.Header {
					if len(values) > 0 {
						headersMap[name] = values[0]
					}
				}

				respChan := make(chan struct {
					status  int
					headers map[string]string
					body    string
				}, 1)

				queueJob(func() {
					reqObj := vm.NewObject()
					reqObj.Set("url", req.URL.String())
					reqObj.Set("method", req.Method)

					reqHeadersObj := vm.NewObject()
					for k, v := range headersMap {
						reqHeadersObj.Set(k, v)
					}
					reqObj.Set("headers", reqHeadersObj)
					reqObj.Set("body", reqBody)

					resObj := vm.NewObject()
					resObj.Set("_headers", make(map[string]string))
					resObj.Set("_statusCode", 200)
					resObj.Set("_body", "")

					resObj.Set("writeHead", func(statusCode int) goja.Value {
						resObj.Set("_statusCode", statusCode)
						return resObj
					})

					resObj.Set("write", func(data string) goja.Value {
						current := resObj.Get("_body").String()
						resObj.Set("_body", current+data)
						return vm.ToValue(true)
					})

					resObj.Set("end", func(data ...goja.Value) goja.Value {
						if len(data) > 0 {
							current := resObj.Get("_body").String()
							resObj.Set("_body", current+data[0].String())
						}
						status := int(resObj.Get("_statusCode").ToInteger())
						body := resObj.Get("_body").String()
						headers := make(map[string]string)
						headersObj := resObj.Get("_headers").ToObject(vm)
						for _, key := range headersObj.Keys() {
							headers[key] = headersObj.Get(key).String()
						}
						respChan <- struct {
							status  int
							headers map[string]string
							body    string
						}{status, headers, body}
						return goja.Undefined()
					})

					resObj.Set("json", func(data goja.Value) goja.Value {
						jsonStr, _ := vm.RunString("JSON.stringify(" + vm.ToValue(data).String() + ")")
						resObj.Set("_body", jsonStr.String())
						resObj.Get("_headers").ToObject(vm).Set("Content-Type", "application/json")
						status := int(resObj.Get("_statusCode").ToInteger())
						headers := make(map[string]string)
						headersObj := resObj.Get("_headers").ToObject(vm)
						for _, key := range headersObj.Keys() {
							headers[key] = headersObj.Get(key).String()
						}
						respChan <- struct {
							status  int
							headers map[string]string
							body    string
						}{status, headers, jsonStr.String()}
						return goja.Undefined()
					})

					if handlerFn != nil {
						handlerFn(goja.Undefined(), reqObj, resObj)
					}
				})

				res := <-respChan
				for k, v := range res.headers {
					w.Header().Set(k, v)
				}
				w.WriteHeader(res.status)
				w.Write([]byte(res.body))
			})

			server = &http.Server{
				Addr:    fmt.Sprintf("%s:%d", host, port),
				Handler: mux,
			}

			go func() {
				var err error
				if certFile != "" && keyFile != "" {
					err = server.ListenAndServeTLS(certFile, keyFile)
				} else {
					err = server.ListenAndServe()
				}
				if err != nil && err != http.ErrServerClosed {
					queueJob(func() {
						onErr := serverObj.Get("onerror")
						if onErr != nil && !goja.IsUndefined(onErr) && !goja.IsNull(onErr) {
							if errCb, ok := goja.AssertFunction(onErr); ok {
								errCb(goja.Undefined(), vm.ToValue(err.Error()))
							}
						}
					})
				}
			}()

			if cb != nil {
				cb(goja.Undefined())
			}

			return serverObj
		})

		serverObj.Set("close", func(call goja.FunctionCall) goja.Value {
			if server != nil {
				server.Close()
			}
			return goja.Undefined()
		})

		serverObj.Set("onerror", func(call goja.FunctionCall) goja.Value {
			return goja.Undefined()
		})

		return serverObj
	})

	vm.Set("https", httpsModule)
}
