package modules

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"

	"github.com/dop251/goja"
)

func RegisterCrypto(vm *goja.Runtime) {
	cryptoObj := vm.NewObject()

	cryptoObj.Set("createHmac", func(algorithm string, key goja.Value) goja.Value {
		if algorithm != "sha256" {
			panic(vm.NewGoError(fmt.Errorf("unsupported algorithm: %s", algorithm)))
		}

		var keyBytes []byte
		if bytes, ok := key.Export().([]byte); ok {
			keyBytes = bytes
		} else {
			keyBytes = []byte(key.String())
		}

		mac := hmac.New(sha256.New, keyBytes)

		hmacObj := vm.NewObject()
		hmacObj.Set("update", func(data goja.Value) goja.Value {
			var dataBytes []byte
			if bytes, ok := data.Export().([]byte); ok {
				dataBytes = bytes
			} else {
				dataBytes = []byte(data.String())
			}
			mac.Write(dataBytes)
			return hmacObj
		})
		hmacObj.Set("digest", func(encoding goja.Value) goja.Value {
			res := mac.Sum(nil)
			if encoding != nil && encoding.String() == "hex" {
				return vm.ToValue(hex.EncodeToString(res))
			}
			return vm.ToValue(res)
		})

		return hmacObj
	})

	cryptoObj.Set("createHash", func(algorithm string) goja.Value {
		if algorithm != "sha256" {
			panic(vm.NewGoError(fmt.Errorf("unsupported algorithm: %s", algorithm)))
		}

		h := sha256.New()

		hashObj := vm.NewObject()
		hashObj.Set("update", func(data goja.Value) goja.Value {
			var dataBytes []byte
			if bytes, ok := data.Export().([]byte); ok {
				dataBytes = bytes
			} else {
				dataBytes = []byte(data.String())
			}
			h.Write(dataBytes)
			return hashObj
		})
		hashObj.Set("digest", func(encoding goja.Value) goja.Value {
			res := h.Sum(nil)
			if encoding != nil && encoding.String() == "hex" {
				return vm.ToValue(hex.EncodeToString(res))
			}
			return vm.ToValue(res)
		})

		return hashObj
	})

	cryptoObj.Set("randomBytes", func(size int) goja.Value {
		bytes := make([]byte, size)
		_, err := rand.Read(bytes)
		if err != nil {
			panic(vm.NewGoError(err))
		}
		return vm.ToValue(bytes)
	})

	vm.Set("crypto", cryptoObj)
}
