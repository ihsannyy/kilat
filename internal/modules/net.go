package modules

import (
	"io/ioutil"
	"kilat/internal/utils"
	"net/http"
	"strings"
	"time"

	"github.com/dop251/goja"
)

func RegisterNet(vm *goja.Runtime, queueJob func(func()), incrementTasks func(), decrementTasks func()) {
	net := vm.NewObject()
	net.Set("fetch", func(url string) map[string]interface{} {
		client := utils.NewHTTPClient(30 * time.Second)
		resp, err := client.Get(url)
		if err != nil {
			panic(vm.NewGoError(err))
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			panic(vm.NewGoError(err))
		}
		return map[string]interface{}{
			"status": resp.StatusCode,
			"body":   string(body),
		}
	})
	vm.Set("net", net)

	vm.Set("__nativeFetch", func(url string, method string, headers map[string]string, body string, callback goja.Value) goja.Value {
		cb, ok := goja.AssertFunction(callback)
		if !ok {
			panic(vm.ToValue("callback must be a function"))
		}

		incrementTasks()

		go func() {
			client := utils.NewHTTPClient(30 * time.Second)
			req, err := http.NewRequest(method, url, strings.NewReader(body))
			if err != nil {
				queueJob(func() {
					defer decrementTasks()
					cb(goja.Undefined(), vm.ToValue(err.Error()), goja.Undefined())
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
					cb(goja.Undefined(), vm.ToValue(err.Error()), goja.Undefined())
				})
				return
			}
			defer resp.Body.Close()
			respBody, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				queueJob(func() {
					defer decrementTasks()
					cb(goja.Undefined(), vm.ToValue(err.Error()), goja.Undefined())
				})
				return
			}

			respHeaders := make(map[string]string)
			for k, v := range resp.Header {
				if len(v) > 0 {
					respHeaders[k] = v[0]
				}
			}

			queueJob(func() {
				defer decrementTasks()
				resObj := vm.NewObject()
				resObj.Set("status", resp.StatusCode)
				resObj.Set("body", string(respBody))
				
				resHeadersObj := vm.NewObject()
				for k, v := range respHeaders {
					resHeadersObj.Set(k, v)
				}
				resObj.Set("headers", resHeadersObj)

				cb(goja.Undefined(), goja.Null(), resObj)
			})
		}()
		return goja.Undefined()
	})
}