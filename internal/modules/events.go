package modules

import (
	"github.com/dop251/goja"
)

func RegisterEvents(vm *goja.Runtime) {
	vm.RunString(`
class EventEmitter {
	constructor() {
		this._events = {};
		this._eventsCount = 0;
	}

	on(event, listener) {
		if (!this._events[event]) {
			this._events[event] = [];
			this._eventsCount++;
		}
		this._events[event].push(listener);
		return this;
	}

	addListener(event, listener) {
		return this.on(event, listener);
	}

	once(event, listener) {
		const wrapper = (...args) => {
			this.removeListener(event, wrapper);
			listener.apply(this, args);
		};
		wrapper._original = listener;
		return this.on(event, wrapper);
	}

	removeListener(event, listener) {
		if (!this._events[event]) return this;
		const list = this._events[event];
		for (let i = list.length - 1; i >= 0; i--) {
			if (list[i] === listener || list[i]._original === listener) {
				list.splice(i, 1);
				break;
			}
		}
		if (list.length === 0) {
			delete this._events[event];
			this._eventsCount--;
		}
		return this;
	}

	off(event, listener) {
		return this.removeListener(event, listener);
	}

	removeAllListeners(event) {
		if (event) {
			if (this._events[event]) {
				delete this._events[event];
				this._eventsCount--;
			}
		} else {
			this._events = {};
			this._eventsCount = 0;
		}
		return this;
	}

	emit(event, ...args) {
		if (!this._events[event]) return false;
		const list = this._events[event].slice();
		for (const listener of list) {
			listener.apply(this, args);
		}
		return true;
	}

	listenerCount(event) {
		if (!this._events[event]) return 0;
		return this._events[event].length;
	}

	listeners(event) {
		if (!this._events[event]) return [];
		return this._events[event].slice();
	}

	eventNames() {
		return Object.keys(this._events);
	}
}

globalThis.EventEmitter = EventEmitter;
	`)
}
