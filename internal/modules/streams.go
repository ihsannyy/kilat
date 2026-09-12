package modules

import (
	"github.com/dop251/goja"
)

func RegisterStreams(vm *goja.Runtime, queueJob func(func()), incrementTasks func(), decrementTasks func()) {
	vm.RunString(`
class Readable {
	constructor(opts) {
		this._buffer = '';
		this._ended = false;
		this._paused = false;
		this._handlers = {};
	}
	on(event, callback) {
		if (!this._handlers[event]) this._handlers[event] = [];
		this._handlers[event].push(callback);
		return this;
	}
	emit(event, ...args) {
		var handlers = this._handlers[event] || [];
		for (var i = 0; i < handlers.length; i++) {
			handlers[i](...args);
		}
		return handlers.length > 0;
	}
	pipe(dest) {
		this.on('data', (chunk) => dest.write(chunk));
		this.on('end', () => { if (dest.end) dest.end(); });
		return dest;
	}
	unpipe(dest) { return this; }
	pause() { this._paused = true; return this; }
	resume() { this._paused = false; return this; }
	read(size) {
		var buf = this._buffer;
		size = size || buf.length;
		if (size > buf.length) size = buf.length;
		var result = buf.substring(0, size);
		this._buffer = buf.substring(size);
		return result;
	}
}
`)

	vm.RunString(`
class Writable {
	constructor(opts) {
		this._buffer = '';
		this._finished = false;
		this._handlers = {};
	}
	on(event, callback) {
		if (!this._handlers[event]) this._handlers[event] = [];
		this._handlers[event].push(callback);
		return this;
	}
	emit(event, ...args) {
		var handlers = this._handlers[event] || [];
		for (var i = 0; i < handlers.length; i++) {
			handlers[i](...args);
		}
		return handlers.length > 0;
	}
	write(data) {
		this._buffer += String(data);
		this.emit('drain');
		return true;
	}
	end(data) {
		if (data) this._buffer += String(data);
		this._finished = true;
		this.emit('finish');
		return this;
	}
	cork() { return this; }
	uncork() { return this; }
	setDefaultEncoding(enc) { return this; }
}
`)

	vm.RunString(`
class Transform {
	constructor(transformFn) {
		this._buffer = '';
		this._transformFn = transformFn || null;
		this._handlers = {};
	}
	on(event, callback) {
		if (!this._handlers[event]) this._handlers[event] = [];
		this._handlers[event].push(callback);
		return this;
	}
	emit(event, ...args) {
		var handlers = this._handlers[event] || [];
		for (var i = 0; i < handlers.length; i++) {
			handlers[i](...args);
		}
		return handlers.length > 0;
	}
	write(data) {
		var input = String(data);
		if (this._transformFn) {
			var result = this._transformFn(input);
			if (result !== undefined && result !== null) {
				this._buffer += String(result);
			}
		} else {
			this._buffer += input;
		}
		this.emit('data', data);
		return true;
	}
	read() {
		var buf = this._buffer;
		this._buffer = '';
		return buf;
	}
	end(data) {
		if (data) {
			var input = String(data);
			if (this._transformFn) {
				var result = this._transformFn(input);
				if (result !== undefined && result !== null) {
					this._buffer += String(result);
				}
			} else {
				this._buffer += input;
			}
		}
		this.emit('end');
		return this;
	}
	pipe(dest) { return dest; }
}

var PassThrough = Transform;
`)
}
