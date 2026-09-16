package modules

import (
	"sync"
	"time"

	"github.com/dop251/goja"
)

type CacheItem struct {
	Value     goja.Value
	ExpiresAt time.Time
}

type Cache struct {
	vm    *goja.Runtime
	mu    sync.RWMutex
	items map[string]CacheItem
}

func RegisterCache(vm *goja.Runtime) {
	c := &Cache{
		vm:    vm,
		items: make(map[string]CacheItem),
	}

	go func() {
		for {
			time.Sleep(time.Second)
			c.mu.Lock()
			now := time.Now()
			for key, item := range c.items {
				if !item.ExpiresAt.IsZero() && now.After(item.ExpiresAt) {
					delete(c.items, key)
				}
			}
			c.mu.Unlock()
		}
	}()

	cacheModule := vm.NewObject()

	cacheModule.Set("set", func(key string, value goja.Value, ttl ...goja.Value) goja.Value {
		var expiresAt time.Time
		if len(ttl) > 0 && !goja.IsUndefined(ttl[0]) && !goja.IsNull(ttl[0]) {
			seconds := ttl[0].ToInteger()
			if seconds > 0 {
				expiresAt = time.Now().Add(time.Duration(seconds) * time.Second)
			}
		}

		c.mu.Lock()
		c.items[key] = CacheItem{
			Value:     value,
			ExpiresAt: expiresAt,
		}
		c.mu.Unlock()
		return goja.Undefined()
	})

	cacheModule.Set("get", func(key string) goja.Value {
		c.mu.RLock()
		item, exists := c.items[key]
		c.mu.RUnlock()

		if !exists {
			return goja.Null()
		}

		if !item.ExpiresAt.IsZero() && time.Now().After(item.ExpiresAt) {
			c.mu.Lock()
			delete(c.items, key)
			c.mu.Unlock()
			return goja.Null()
		}

		return item.Value
	})

	cacheModule.Set("has", func(key string) goja.Value {
		c.mu.RLock()
		item, exists := c.items[key]
		c.mu.RUnlock()

		if !exists {
			return vm.ToValue(false)
		}

		if !item.ExpiresAt.IsZero() && time.Now().After(item.ExpiresAt) {
			c.mu.Lock()
			delete(c.items, key)
			c.mu.Unlock()
			return vm.ToValue(false)
		}

		return vm.ToValue(true)
	})

	cacheModule.Set("delete", func(key string) goja.Value {
		c.mu.Lock()
		delete(c.items, key)
		c.mu.Unlock()
		return goja.Undefined()
	})

	cacheModule.Set("clear", func() goja.Value {
		c.mu.Lock()
		c.items = make(map[string]CacheItem)
		c.mu.Unlock()
		return goja.Undefined()
	})

	cacheModule.Set("keys", func() goja.Value {
		c.mu.RLock()
		defer c.mu.RUnlock()

		keys := make([]goja.Value, 0)
		now := time.Now()
		for key, item := range c.items {
			if item.ExpiresAt.IsZero() || now.Before(item.ExpiresAt) {
				keys = append(keys, vm.ToValue(key))
			}
		}
		return vm.ToValue(keys)
	})

	cacheModule.Set("size", func() goja.Value {
		c.mu.RLock()
		defer c.mu.RUnlock()
		return vm.ToValue(len(c.items))
	})

	vm.Set("cache", cacheModule)
}
