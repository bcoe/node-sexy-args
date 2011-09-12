var parser = new (require('./parser').Parser),
    puts = require('sys').puts;

exports.args = function(argumentDescriptions, defaults, callback) {
    if (!argumentDescriptions.length || typeof(argumentDescriptions[0]) !== 'object') {
        throw new Error('sexy-args.Parser: first argument must be a reference to the calling scope.');
    }
    
    if (typeof(defaults) == 'function') {
        callback = defaults;
        defaults = {};
    }
    
    parser.run(argumentDescriptions[0], arguments.callee.caller.arguments, argumentDescriptions.slice(1), callback);
};