package modules

import (
	"sync"

	"github.com/dop251/goja"
)

type EventEmitter struct {
	vm       *goja.Runtime
	mu       sync.RWMutex
	handlers map[string][]func(goja.FunctionCall) goja.Value
}

func RegisterEvents(vm *goja.Runtime) {
	em := &EventEmitter{
		vm:       vm,
		handlers: make(map[string][]func(goja.FunctionCall) goja.Value),
	}

	eventsModule := vm.NewObject()

	eventsModule.Set("on", func(event string, handler goja.Value) goja.Value {
		if fn, ok := goja.AssertFunction(handler); ok {
			em.mu.Lock()
			em.handlers[event] = append(em.handlers[event], func(call goja.FunctionCall) goja.Value {
				fn(goja.Undefined(), call.Arguments...)
				return goja.Undefined()
			})
			em.mu.Unlock()
		}
		return eventsModule
	})

	eventsModule.Set("off", func(event string, handler goja.Value) goja.Value {
		em.mu.Lock()
		defer em.mu.Unlock()

		if handler == nil || goja.IsUndefined(handler) || goja.IsNull(handler) {
			delete(em.handlers, event)
			return eventsModule
		}

		if _, ok := goja.AssertFunction(handler); ok {
			delete(em.handlers, event)
		}
		return eventsModule
	})

	eventsModule.Set("emit", func(event string, args ...goja.Value) goja.Value {
		em.mu.RLock()
		handlers := make([]func(goja.FunctionCall) goja.Value, len(em.handlers[event]))
		copy(handlers, em.handlers[event])
		em.mu.RUnlock()

		for _, handler := range handlers {
			handlerArgs := make([]goja.Value, len(args))
			for i, arg := range args {
				handlerArgs[i] = arg
			}
			handler(goja.FunctionCall{Arguments: handlerArgs})
		}
		return goja.Undefined()
	})

	eventsModule.Set("once", func(event string, handler goja.Value) goja.Value {
		if fn, ok := goja.AssertFunction(handler); ok {
			em.mu.Lock()
			em.handlers[event] = append(em.handlers[event], func(call goja.FunctionCall) goja.Value {
				fnArgs := make([]goja.Value, len(call.Arguments))
				for i, arg := range call.Arguments {
					fnArgs[i] = arg
				}
				fn(goja.Undefined(), fnArgs...)
				return goja.Undefined()
			})
			em.mu.Unlock()
		}
		return eventsModule
	})

	eventsModule.Set("listeners", func(event string) goja.Value {
		em.mu.RLock()
		defer em.mu.RUnlock()

		count := len(em.handlers[event])
		return vm.ToValue(count)
	})

	eventsModule.Set("clear", func() goja.Value {
		em.mu.Lock()
		em.handlers = make(map[string][]func(goja.FunctionCall) goja.Value)
		em.mu.Unlock()
		return goja.Undefined()
	})

	vm.Set("events", eventsModule)
}
