var parser = new (require('./parser').Parser),
    puts = require('sys').puts;

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