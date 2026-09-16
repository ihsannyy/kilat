package modules

import (
	"github.com/dop251/goja"
)

func RegisterQueryString(vm *goja.Runtime) {
	vm.RunString(`
var querystring = {
	parse: function(str, sep, eq) {
		if (!str) return {};
		sep = sep || '&';
		eq = eq || '=';
		var result = {};
		var pairs = str.split(sep);
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			if (!pair) continue;
			var idx = pair.indexOf(eq);
			if (idx === -1) {
				result[decodeURIComponent(pair)] = '';
			} else {
				var key = pair.substring(0, idx);
				var val = pair.substring(idx + 1);
				result[decodeURIComponent(key)] = decodeURIComponent(val);
			}
		}
		return result;
	},

	stringify: function(obj, sep, eq) {
		if (!obj || typeof obj !== 'object') return '';
		sep = sep || '&';
		eq = eq || '=';
		var pairs = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				var val = obj[key];
				if (val === null || val === undefined) {
					pairs.push(encodeURIComponent(key));
				} else if (Array.isArray(val)) {
					for (var i = 0; i < val.length; i++) {
						pairs.push(encodeURIComponent(key) + eq + encodeURIComponent(val[i]));
					}
				} else {
					pairs.push(encodeURIComponent(key) + eq + encodeURIComponent(val));
				}
			}
		}
		return pairs.join(sep);
	},

	escape: function(str) {
		return encodeURIComponent(str)
			.replace(/%20/g, '+')
			.replace(/%21/g, '!')
			.replace(/%27/g, "'")
			.replace(/%28/g, '(')
			.replace(/%29/g, ')')
			.replace(/%2A/g, '*')
			.replace(/%7E/g, '~');
	},

	unescape: function(str) {
		return decodeURIComponent(str.replace(/\+/g, ' '));
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
	},

	encode: function(obj) {
		return querystring.stringify(obj);
	},

	decode: function(str) {
		return querystring.parse(str);
	}
};

globalThis.querystring = querystring;
	`)
}
