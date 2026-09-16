package modules

import (
	"sync"
	"time"

	"github.com/dop251/goja"
)

type TimerEntry struct {
	active   bool
	isRepeat bool
	id       int64
	stopCh   chan struct{}
	mu       sync.Mutex
}

type TimerManager struct {
	mu     sync.Mutex
	timers map[int64]*TimerEntry
	nextID int64
}

func NewTimerManager() *TimerManager {
	return &TimerManager{
		timers: make(map[int64]*TimerEntry),
		nextID: 1,
	}
}

func (tm *TimerManager) NextID() int64 {
	tm.mu.Lock()
	defer tm.mu.Unlock()
	id := tm.nextID
	tm.nextID++
	return id
}

func (tm *TimerManager) Remove(id int64) {
	tm.mu.Lock()
	entry, ok := tm.timers[id]
	tm.mu.Unlock()
	if ok {
		entry.mu.Lock()
		entry.active = false
		close(entry.stopCh)
		entry.mu.Unlock()
		tm.mu.Lock()
		delete(tm.timers, id)
		tm.mu.Unlock()
	}
}

func (tm *TimerManager) IsActive(id int64) bool {
	tm.mu.Lock()
	entry, ok := tm.timers[id]
	tm.mu.Unlock()
	if !ok {
		return false
	}
	entry.mu.Lock()
	defer entry.mu.Unlock()
	return entry.active
}

func RegisterTimers(vm *goja.Runtime, queueJob func(func()), incrementTasks func(), decrementTasks func()) {
	mgr := NewTimerManager()

	setTimeout := func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			throwTypeError(vm, "setTimeout requires at least 1 argument")
		}
		callback, ok := goja.AssertFunction(call.Arguments[0])
		if !ok {
			throwTypeError(vm, "setTimeout first argument must be a function")
		}

		delay := int64(0)
		if len(call.Arguments) > 1 {
			delay = int64(call.Arguments[1].ToInteger())
		}
		if delay < 0 {
			delay = 0
		}

		id := mgr.NextID()
		entry := &TimerEntry{
			isRepeat: false,
			id:       id,
			active:   true,
			stopCh:   make(chan struct{}),
		}

		mgr.mu.Lock()
		mgr.timers[id] = entry
		mgr.mu.Unlock()

		incrementTasks()

		go func() {
			select {
			case <-time.After(time.Duration(delay) * time.Millisecond):
				if !mgr.IsActive(id) {
					decrementTasks()
					return
				}
				queueJob(func() {
					defer decrementTasks()
					mgr.Remove(id)
					_, _ = callback(goja.Undefined())
				})
			case <-entry.stopCh:
				decrementTasks()
			}
		}()

		return vm.ToValue(id)
	}

	setInterval := func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			throwTypeError(vm, "setInterval requires at least 1 argument")
		}
		callback, ok := goja.AssertFunction(call.Arguments[0])
		if !ok {
			throwTypeError(vm, "setInterval first argument must be a function")
		}

		interval := int64(0)
		if len(call.Arguments) > 1 {
			interval = int64(call.Arguments[1].ToInteger())
		}
		if interval <= 0 {
			interval = 1
		}

		id := mgr.NextID()
		entry := &TimerEntry{
			isRepeat: true,
			id:       id,
			active:   true,
			stopCh:   make(chan struct{}),
		}

		mgr.mu.Lock()
		mgr.timers[id] = entry
		mgr.mu.Unlock()

		incrementTasks()

		go func() {
			ticker := time.NewTicker(time.Duration(interval) * time.Millisecond)
			defer ticker.Stop()
			for {
				select {
				case <-ticker.C:
					if !mgr.IsActive(id) {
						decrementTasks()
						return
					}
					queueJob(func() {
						if !mgr.IsActive(id) {
							return
						}
						_, _ = callback(goja.Undefined())
					})
				case <-entry.stopCh:
					decrementTasks()
					return
				}
			}
		}()

		return vm.ToValue(id)
	}

	clearTimeout := func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) > 0 && !goja.IsUndefined(call.Arguments[0]) && !goja.IsNull(call.Arguments[0]) {
			id := int64(call.Arguments[0].ToInteger())
			mgr.Remove(id)
		}
		return goja.Undefined()
	}

	clearInterval := clearTimeout

	vm.Set("setTimeout", setTimeout)
	vm.Set("setInterval", setInterval)
	vm.Set("clearTimeout", clearTimeout)
	vm.Set("clearInterval", clearInterval)
}
