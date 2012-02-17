var parser = new (require('./parser').Parser),
	puts = require('util').puts;

exports.args = function(argumentDescriptions, defaults, callback) {
	if (!argumentDescriptions.length || typeof(argumentDescriptions[0]) !== 'object') {
		throw new Error('sexy-args.Parser: first argument must be a reference to the calling scope.');
	}
	
	if (argumentDescriptions.length == 1) {
		argumentDescriptions = [argumentDescriptions[0], ['function1', 'object1'], 'function1'];
	}
	
	if (typeof(defaults) == 'function') {
		callback = defaults;
		defaults = {};
	}
	
	parser.run({
		originalContext: argumentDescriptions[0],
		originalArguments: arguments.callee.caller.arguments,
		argumentDescriptions: argumentDescriptions.slice(1),
		callback: callback,
		defaults: defaults
	});
};

exports.extend = function(a, b, c) {
	exports.args([this, 'object1', 'object2', 'object3'], {
		object1: {}, object2: {}, object3: {}
	}, function() {
		for (var key in c) {
			if (c.hasOwnProperty(key)) {
				b[key] = c[key];
			}
		}

		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
	});
};