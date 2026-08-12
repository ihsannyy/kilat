package modules

import (
	"crypto/hmac"
	"crypto/md5"
	"crypto/rand"
	"crypto/sha1"
	"crypto/sha256"
	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"hash"
	"strings"

	"github.com/dop251/goja"
)

func getHashFunc(algorithm string) (func() hash.Hash, error) {
	switch strings.ToLower(algorithm) {
	case "sha256":
		return sha256.New, nil
	case "sha512":
		return sha512.New, nil
	case "sha1":
		return sha1.New, nil
	case "md5":
		return md5.New, nil
	default:
		return nil, fmt.Errorf("unsupported algorithm: %s", algorithm)
	}
}

func RegisterCrypto(vm *goja.Runtime) {
	cryptoObj := vm.NewObject()

	cryptoObj.Set("createHmac", func(algorithm string, key goja.Value) goja.Value {
		hFunc, err := getHashFunc(algorithm)
		if err != nil {
			panic(vm.NewGoError(err))
		}

		var keyBytes []byte
		if bytes, ok := key.Export().([]byte); ok {
			keyBytes = bytes
		} else {
			keyBytes = []byte(key.String())
		}

		mac := hmac.New(hFunc, keyBytes)

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
		hFunc, err := getHashFunc(algorithm)
		if err != nil {
			panic(vm.NewGoError(err))
		}

		h := hFunc()

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
