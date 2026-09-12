package modules

import (
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"

	"github.com/dop251/goja"
)

func createBufferFromBytes(vm *goja.Runtime, data []byte) goja.Value {
	buf := make([]byte, len(data))
	copy(buf, data)

	bufObj := vm.NewObject()
	bufObj.Set("length", len(buf))

	bufObj.Set("toString", func(encoding goja.Value) string {
		enc := "utf8"
		if encoding != nil && !goja.IsUndefined(encoding) && !goja.IsNull(encoding) {
			enc = strings.ToLower(encoding.String())
		}
		switch enc {
		case "hex":
			return hex.EncodeToString(buf)
		case "base64":
			return base64.StdEncoding.EncodeToString(buf)
		default:
			return string(buf)
		}
	})

	bufObj.Set("slice", func(startVal, endVal goja.Value) goja.Value {
		start := 0
		if startVal != nil && !goja.IsUndefined(startVal) && !goja.IsNull(startVal) {
			start = int(startVal.ToInteger())
		}
		end := len(buf)
		if endVal != nil && !goja.IsUndefined(endVal) && !goja.IsNull(endVal) {
			end = int(endVal.ToInteger())
		}
		if start < 0 {
			start = len(buf) + start
		}
		if end < 0 {
			end = len(buf) + end
		}
		if start > end {
			start = end
		}
		if start < 0 {
			start = 0
		}
		if end > len(buf) {
			end = len(buf)
		}
		newBuf := make([]byte, end-start)
		copy(newBuf, buf[start:end])
		return createBufferFromBytes(vm, newBuf)
	})

	bufObj.Set("fill", func(value goja.Value, startVal, endVal goja.Value) goja.Value {
		start := 0
		if startVal != nil && !goja.IsUndefined(startVal) && !goja.IsNull(startVal) {
			start = int(startVal.ToInteger())
		}
		end := len(buf)
		if endVal != nil && !goja.IsUndefined(endVal) && !goja.IsNull(endVal) {
			end = int(endVal.ToInteger())
		}
		if start < 0 {
			start = 0
		}
		if end > len(buf) {
			end = len(buf)
		}
		fillByte := byte(0)
		if value != nil && !goja.IsUndefined(value) && !goja.IsNull(value) {
			fillByte = byte(value.ToInteger())
		}
		for i := start; i < end; i++ {
			buf[i] = fillByte
		}
		return bufObj
	})

	bufObj.Set("copy", func(target goja.Value, targetStartVal, sourceStartVal, sourceEndVal goja.Value) goja.Value {
		targetObj := target.ToObject(vm)
		targetLenVal := targetObj.Get("length")
		targetLen := int(targetLenVal.ToInteger())
		targetBytes := make([]byte, targetLen)
		for i := 0; i < targetLen; i++ {
			v := targetObj.Get(strconv.Itoa(i))
			if v != nil && !goja.IsUndefined(v) && !goja.IsNull(v) {
				targetBytes[i] = byte(v.ToInteger())
			}
		}

		targetStart := 0
		if targetStartVal != nil && !goja.IsUndefined(targetStartVal) && !goja.IsNull(targetStartVal) {
			targetStart = int(targetStartVal.ToInteger())
		}
		sourceStart := 0
		if sourceStartVal != nil && !goja.IsUndefined(sourceStartVal) && !goja.IsNull(sourceStartVal) {
			sourceStart = int(sourceStartVal.ToInteger())
		}
		sourceEnd := len(buf)
		if sourceEndVal != nil && !goja.IsUndefined(sourceEndVal) && !goja.IsNull(sourceEndVal) {
			sourceEnd = int(sourceEndVal.ToInteger())
		}

		n := copy(targetBytes[targetStart:], buf[sourceStart:sourceEnd])
		return vm.ToValue(n)
	})

	bufObj.Set("write", func(str string, offsetVal goja.Value) goja.Value {
		offset := 0
		if offsetVal != nil && !goja.IsUndefined(offsetVal) && !goja.IsNull(offsetVal) {
			offset = int(offsetVal.ToInteger())
		}
		n := copy(buf[offset:], []byte(str))
		return vm.ToValue(n)
	})

	for i := 0; i < len(buf); i++ {
		idx := strconv.Itoa(i)
		b := buf[i]
		bufObj.Set(idx, vm.ToValue(b))
	}

	return bufObj
}

func RegisterBuffer(vm *goja.Runtime) {
	bufferObj := vm.NewObject()

	bufferObj.Set("from", func(args ...goja.Value) goja.Value {
		if len(args) == 0 {
			return createBufferFromBytes(vm, []byte{})
		}
		arg := args[0]
		argExport := arg.Export()

		switch v := argExport.(type) {
		case string:
			encoding := "utf8"
			if len(args) > 1 {
				encoding = strings.ToLower(args[1].String())
			}
			switch encoding {
			case "hex":
				b, err := hex.DecodeString(v)
				if err != nil {
					panic(vm.NewGoError(fmt.Errorf("invalid hex string: %w", err)))
				}
				return createBufferFromBytes(vm, b)
			case "base64":
				b, err := base64.StdEncoding.DecodeString(v)
				if err != nil {
					panic(vm.NewGoError(fmt.Errorf("invalid base64 string: %w", err)))
				}
				return createBufferFromBytes(vm, b)
			default:
				return createBufferFromBytes(vm, []byte(v))
			}
		default:
			return createBufferFromBytes(vm, []byte(arg.String()))
		}
	})

	bufferObj.Set("alloc", func(args ...goja.Value) goja.Value {
		if len(args) == 0 {
			return createBufferFromBytes(vm, []byte{})
		}
		size := int(args[0].ToInteger())
		if size < 0 {
			panic(vm.NewGoError(fmt.Errorf("invalid buffer size")))
		}
		data := make([]byte, size)
		if len(args) > 1 && !goja.IsUndefined(args[1]) && !goja.IsNull(args[1]) {
			fillByte := byte(args[1].ToInteger())
			for i := range data {
				data[i] = fillByte
			}
		}
		return createBufferFromBytes(vm, data)
	})

	bufferObj.Set("allocUnsafe", func(args ...goja.Value) goja.Value {
		if len(args) == 0 {
			return createBufferFromBytes(vm, []byte{})
		}
		size := int(args[0].ToInteger())
		return createBufferFromBytes(vm, make([]byte, size))
	})

	bufferObj.Set("allocUnsafeSlow", func(args ...goja.Value) goja.Value {
		if len(args) == 0 {
			return createBufferFromBytes(vm, []byte{})
		}
		size := int(args[0].ToInteger())
		return createBufferFromBytes(vm, make([]byte, size))
	})

	bufferObj.Set("concat", func(args ...goja.Value) goja.Value {
		if len(args) == 0 {
			return createBufferFromBytes(vm, []byte{})
		}
		listVal := args[0]
		if listArr, ok := listVal.Export().([]interface{}); ok {
			var combined []byte
			for _, item := range listArr {
				itemObj := item.(goja.Value).ToObject(vm)
				length := int(itemObj.Get("length").ToInteger())
				buf := make([]byte, length)
				for i := 0; i < length; i++ {
					v := itemObj.Get(strconv.Itoa(i))
					if v != nil && !goja.IsUndefined(v) && !goja.IsNull(v) {
						buf[i] = byte(v.ToInteger())
					}
				}
				combined = append(combined, buf...)
			}
			return createBufferFromBytes(vm, combined)
		}
		return createBufferFromBytes(vm, []byte{})
	})

	bufferObj.Set("isBuffer", func(obj goja.Value) bool {
		if obj == nil || goja.IsUndefined(obj) || goja.IsNull(obj) {
			return false
		}
		o := obj.ToObject(vm)
		lengthVal := o.Get("length")
		return lengthVal != nil && !goja.IsUndefined(lengthVal)
	})

	bufferObj.Set("byteLength", func(str goja.Value) int {
		if str == nil || goja.IsUndefined(str) || goja.IsNull(str) {
			return 0
		}
		return len(str.String())
	})

	bufferObj.Set("compare", func(buf1, buf2 goja.Value) int {
		b1 := []byte(buf1.String())
		b2 := []byte(buf2.String())
		return stringByteCompare(string(b1), string(b2))
	})

	vm.Set("Buffer", bufferObj)

	vm.Set("__bufferFrom", func(data string) goja.Value {
		return createBufferFromBytes(vm, []byte(data))
	})

	vm.Set("__bufferFromHex", func(data string) goja.Value {
		b, err := hex.DecodeString(data)
		if err != nil {
			panic(vm.NewGoError(err))
		}
		return createBufferFromBytes(vm, b)
	})

	vm.Set("__bufferFromBase64", func(data string) goja.Value {
		b, err := base64.StdEncoding.DecodeString(data)
		if err != nil {
			panic(vm.NewGoError(err))
		}
		return createBufferFromBytes(vm, b)
	})
}

func stringByteCompare(a, b string) int {
	if a < b {
		return -1
	}
	if a > b {
		return 1
	}
	return 0
}
