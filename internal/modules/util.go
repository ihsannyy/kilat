package modules

import (
	"github.com/dop251/goja"
)

func RegisterUtil(vm *goja.Runtime) {
	vm.RunString(`
var util = {
	promisify: function(fn) {
		return function() {
			var args = Array.prototype.slice.call(arguments);
			return new Promise(function(resolve, reject) {
				args.push(function(err, result) {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
				fn.apply(null, args);
			});
		};
	},

	inspect: function(obj, depth) {
		if (obj === null) return 'null';
		if (obj === undefined) return 'undefined';
		if (typeof obj === 'string') return "'" + obj + "'";
		if (typeof obj === 'number') return String(obj);
		if (typeof obj === 'boolean') return String(obj);
		if (typeof obj === 'function') return '[Function]';
		if (Array.isArray(obj)) {
			if (depth === undefined) depth = 2;
			if (depth <= 0) return '[Array]';
			var items = [];
			for (var i = 0; i < obj.length; i++) {
				items.push(util.inspect(obj[i], depth - 1));
			}
			return '[' + items.join(', ') + ']';
		}
		if (typeof obj === 'object') {
			if (depth === undefined) depth = 2;
			if (depth <= 0) return '[Object]';
			var pairs = [];
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					pairs.push(key + ': ' + util.inspect(obj[key], depth - 1));
				}
			}
			return '{ ' + pairs.join(', ') + ' }';
		}
		return String(obj);
	},

	format: function(formatStr) {
		var args = Array.prototype.slice.call(arguments, 1);
		var idx = 0;
		return formatStr.replace(/%[sdjf%]/g, function(match) {
			if (match === '%%') return '%';
			if (idx >= args.length) return match;
			var val = args[idx++];
			switch (match) {
				case '%s': return String(val);
				case '%d': return parseInt(val, 10) || 0;
				case '%j': return JSON.stringify(val);
				case '%f': return parseFloat(val) || 0;
				default: return match;
			}
		});
	},

	isArray: function(obj) {
		return Array.isArray(obj);
	},

	isDate: function(obj) {
		return obj instanceof Date;
	},

	isError: function(obj) {
		return obj instanceof Error;
	},

	isFunction: function(obj) {
		return typeof obj === 'function';
	},

	isNull: function(obj) {
		return obj === null;
	},

	isNumber: function(obj) {
		return typeof obj === 'number';
	},

	isObject: function(obj) {
		return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
	},

	isPrimitive: function(obj) {
		var t = typeof obj;
		return t === 'string' || t === 'number' || t === 'boolean' || t === 'undefined';
	},

	isString: function(obj) {
		return typeof obj === 'string';
	},

	isUndefined: function(obj) {
		return typeof obj === 'undefined';
	},

	inherits: function(ctor, superCtor) {
		ctor.super_ = superCtor;
		ctor.prototype = Object.create(superCtor.prototype, {
			constructor: {
				value: ctor,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
	},

	callbackify: function(fn) {
		return function() {
			var args = Array.prototype.slice.call(arguments);
			var callback = args.pop();
			fn.apply(null, args).then(
				function(result) { callback(null, result); },
				function(err) { callback(err); }
			);
		};
	},

	debounce: function(fn, delay) {
		var timer;
		return function() {
			var args = arguments;
			var context = this;
			clearTimeout(timer);
			timer = setTimeout(function() {
				fn.apply(context, args);
			}, delay);
		};
	},

	throttle: function(fn, limit) {
		var inThrottle;
		var lastFn;
		var lastTime;
		return function() {
			var args = arguments;
			var context = this;
			if (!inThrottle) {
				fn.apply(context, args);
				lastTime = Date.now();
				inThrottle = true;
			} else {
				clearTimeout(lastFn);
				lastFn = setTimeout(function() {
					if (Date.now() - lastTime >= limit) {
						fn.apply(context, args);
						lastTime = Date.now();
					}
				}, limit - (Date.now() - lastTime));
			}
		};
	},

	extend: function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			if (source) {
				for (var key in source) {
					if (source.hasOwnProperty(key)) {
						target[key] = source[key];
					}
				}
			}
		}
		return target;
	},

	merge: function(target, source) {
		var result = {};
		for (var key in target) {
			if (target.hasOwnProperty(key)) {
				result[key] = target[key];
			}
		}
		for (var key in source) {
			if (source.hasOwnProperty(key)) {
				result[key] = source[key];
			}
		}
		return result;
	},

	pick: function(obj, keys) {
		var result = {};
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (obj.hasOwnProperty(key)) {
				result[key] = obj[key];
			}
		}
		return result;
	},

	omit: function(obj, keys) {
		var result = {};
		for (var key in obj) {
			if (obj.hasOwnProperty(key) && keys.indexOf(key) === -1) {
				result[key] = obj[key];
			}
		}
		return result;
	}
};

globalThis.util = util;
	`)
}
