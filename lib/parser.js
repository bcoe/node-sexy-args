var puts = require('sys').puts;

exports.Parser = function() {
    this.DEFAULTS_BY_TYPE = {
        'function': function() {
            return (function() {});
        },
        'object': function() {
            return {};
        },
        'array': function() {
            return [];
        }
    };
};

exports.Parser.prototype.run = function(params) {
    
    this._extend(this, params);
    this.originalFunction = this.originalArguments.callee;
        
    if (this.originalFunction.___complete) {
        this._executeCallback();
    } else {
        this._performParse();
        this._reinvokeOriginalFunction();
    }
};

exports.Parser.prototype._executeCallback = function() {
    delete this.originalFunction.___complete;
    this.callback.apply(this.originalContext, this.originalArguments);
};

exports.Parser.prototype._performParse = function() {
    this._createArgumentsToApplyObject();
    this._createArgumentsStack();
    this._and(this.argumentDescriptions);
};

exports.Parser.prototype._reinvokeOriginalFunction = function() {
    this.originalFunction.___complete = true;
    
    var args = [];
    
    for (var key in this.argumentsToApply) {
        if (this.argumentsToApply.hasOwnProperty(key)) {
            arg = this.argumentsToApply[key];
            args[arg.index] = arg.value;
        }
    }
    this.originalFunction.apply(this.originalContext, args);
};

exports.Parser.prototype._createArgumentsToApplyObject = function() {
    var _this = this;
    
    this.argumentsToApply = {};
    
    function _or(argumentDescriptions, index) {
        for (var i = 0, argumentDescription; (argumentDescription = argumentDescriptions[i]) != null; i++) {
            _argument(argumentDescription, index);
        };
    }
    
    function _argument(argumentDescription, index) {
        var argument = {
            index: index,
            value: _this._getDefaultValue(argumentDescription)
        };
        _this.argumentsToApply[argumentDescription] = argument;
    }
    
    for (var i = 0, argumentDescription; (argumentDescription = this.argumentDescriptions[i]) != null; i++) {
        if ( Array.isArray(argumentDescription) ) {
            _or(argumentDescription, i);
        } else {
            _argument(argumentDescription, i);
        }
    };
};

exports.Parser.prototype._getDefaultValue = function(key) {
    if (this.defaults[key]) {
        return this.defaults[key];
    }
    
    var value = this.DEFAULTS_BY_TYPE[key.slice(0, -1)];
    if (typeof(value) === 'function') {
        return value();
    }
    return undefined;
};

exports.Parser.prototype._createArgumentsStack = function() {
    this.argumentsStack = [];
    
    for (var i = 0; i < this.originalArguments.length; i++) {
        this.argumentsStack.push(this.originalArguments[i]);
    }
};

exports.Parser.prototype._and = function(argumentDescriptions) {
    for (var i = 0, argumentDescription; (argumentDescription = argumentDescriptions[i]) != null; i++) {
        
        if (!this.argumentsStack.length) {
            return;
        }
        
        var argument = this.argumentsStack.shift();
        
        if ( Array.isArray(argumentDescription) ) {
            this._or(argumentDescription, argument, i);
        } else {
            this._argument(argumentDescription, argument, i);
        }
        
    }
    
    this._populateAdditionalArguments(i);
};

exports.Parser.prototype._populateAdditionalArguments = function(index) {
    for (var i = 0; i < this.argumentsStack.length; i++) {
        this.argumentsToApply['_' + i] = {
            value: this.argumentsStack[i],
            index: i + index
        };
    }
};

exports.Parser.prototype._or = function(argumentDescriptions, argument, index) {
    for (var i = 0, argumentDescription; (argumentDescription = argumentDescriptions[i]) != null; i++) {
        var type = argumentDescription.slice(0, -1);
        
        if (typeof(argument) === type) {
            this._setArgumentValue(argumentDescription, argument, type);
            return;
        }
    }
    
    this._throwError("'or' statement failed to evaluate.", index);
};

exports.Parser.prototype._argument = function(argumentDescription, argument, index) {
    var type = argumentDescription.slice(0, -1);
    
    if (this._typeof(argument) !== type) {
        this._throwError("typeof(" + argumentDescription + ") should be '" + type + "' was " + typeof(argument), index);
    }
    if (argument) {
        this._setArgumentValue(argumentDescription, argument, type);
    }
};

exports.Parser.prototype._setArgumentValue = function(key, value, type) {
    if (type === 'object') {
        this._extend(this.argumentsToApply[key].value, value);
    } else {
        this.argumentsToApply[key].value = value;
    }
};

exports.Parser.prototype._throwError = function(reason, index) {
    throw new Error('sexy-args.Parser: could not parse argument ' + index + '. ' + reason);
}

exports.Parser.prototype._typeof = function(variable) {    
    if (Array.isArray(variable)) {
        return 'array';
    }
    return typeof(variable);
};

exports.Parser.prototype._extend = function(obj1, obj2) {
    for (var key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            obj1[key] = obj2[key];
        }
    }
};