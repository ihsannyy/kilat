package modules

import (
	"sync"
	"time"

	"github.com/dop251/goja"
)

type CronJob struct {
	ID       string
	Interval time.Duration
	Handler  goja.FunctionCall
	Stop     chan struct{}
	Running  bool
}

type Cron struct {
	vm    *goja.Runtime
	mu    sync.RWMutex
	jobs  map[string]*CronJob
	queue func(func())
}

func RegisterCron(vm *goja.Runtime, queueJob func(func()), incrementTasks func(), decrementTasks func()) {
	c := &Cron{
		vm:    vm,
		jobs:  make(map[string]*CronJob),
		queue: queueJob,
	}

	cronModule := vm.NewObject()

	cronModule.Set("every", func(interval string, handler goja.Value) goja.Value {
		d, err := time.ParseDuration(interval)
		if err != nil {
			throwTypeErrorf(vm, "invalid interval format: %s", interval)
		}

		fn, ok := goja.AssertFunction(handler)
		if !ok {
			throwTypeError(vm, "handler must be a function")
		}

		id := generateID()
		job := &CronJob{
			ID:       id,
			Interval: d,
			Stop:     make(chan struct{}),
			Running:  true,
		}

		c.mu.Lock()
		c.jobs[id] = job
		c.mu.Unlock()

		incrementTasks()

		go func() {
			defer decrementTasks()
			ticker := time.NewTicker(d)
			defer ticker.Stop()

			for {
				select {
				case <-job.Stop:
					return
				case <-ticker.C:
					if job.Running {
						c.queue(func() {
							fn(goja.Undefined())
						})
					}
				}
			}
		}()

		result := vm.NewObject()
		result.Set("id", id)
		result.Set("stop", func() goja.Value {
			c.mu.Lock()
			if job, ok := c.jobs[id]; ok {
				job.Running = false
				close(job.Stop)
				delete(c.jobs, id)
			}
			c.mu.Unlock()
			return goja.Undefined()
		})
		return result
	})

	cronModule.Set("after", func(delay string, handler goja.Value) goja.Value {
		d, err := time.ParseDuration(delay)
		if err != nil {
			throwTypeErrorf(vm, "invalid delay format: %s", delay)
		}

		fn, ok := goja.AssertFunction(handler)
		if !ok {
			throwTypeError(vm, "handler must be a function")
		}

		incrementTasks()

		go func() {
			defer decrementTasks()
			time.Sleep(d)
			c.queue(func() {
				fn(goja.Undefined())
			})
		}()

		return goja.Undefined()
	})

	cronModule.Set("stop", func(ids ...goja.Value) goja.Value {
		c.mu.Lock()
		defer c.mu.Unlock()

		if len(ids) == 0 {
			for id, job := range c.jobs {
				job.Running = false
				close(job.Stop)
				delete(c.jobs, id)
			}
		} else {
			for _, idVal := range ids {
				id := idVal.String()
				if job, ok := c.jobs[id]; ok {
					job.Running = false
					close(job.Stop)
					delete(c.jobs, id)
				}
			}
		}
		return goja.Undefined()
	})

	cronModule.Set("list", func() goja.Value {
		c.mu.RLock()
		defer c.mu.RUnlock()

		ids := make([]goja.Value, 0)
		for id := range c.jobs {
			ids = append(ids, vm.ToValue(id))
		}
		return vm.ToValue(ids)
	})

	vm.Set("cron", cronModule)
}

func generateID() string {
	return time.Now().Format("20060102150405.000000000")
}
