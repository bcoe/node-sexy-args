Sexy Arguments
==============

Motivation
----------

I was working on one of my Node.js libraries and noticed I was doing something silly:

*Karait (https://github.com/bcoe/karait)*

```javascript
exports.Queue = function(params, onQueueReady) {
    
    if (typeof(params) === 'function') {
        onQueueReady = params;
        params = {};
    }
    
    var defaults = {
        host: 'localhost',
        port: 27017,
        database: 'karait',
        queue: 'messages',
        averageMessageSize: 8192,
        queueSize: 4096
    };
    extend(this, defaults, params);
}
```

There's a lot of ritual around dealing with optional arguments and default parameters!

I did a little literature review, and found this problem was pretty widespread:

*Node MongoDB Native (https://github.com/christkv/node-mongodb-native)*

```javascript
Collection.prototype.insertAll = function insertAll (docs, options, callback) {
  if('function' === typeof options) callback = options, options = {};  
  if(options == null) options = {};
  if(!('function' === typeof callback)) callback = null;
}
```

*Express (https://github.com/visionmedia/express)*

```javascript
res.sendfile = function(path, options, fn){
  var self = this
    , req = self.req
    , next = this.req.next
    , options = options || {};

  // support function as second arg
  if ('function' == typeof options) {
    fn = options;
    options = {};
  }
};
```

*JSDom (https://github.com/tmpvar/jsdom)*

```javascript
exports.jQueryify = exports.jsdom.jQueryify = function (window /* path [optional], callback */) {
  var args = Array.prototype.slice.call(arguments),
      callback = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      path,
      jQueryTag = window.document.createElement("script");

  if (args.length > 1 && typeof(args[1] === 'string')) {
    path = args[1];
  }
}
```

The Solution? Sexy Arguments
----------------------------

sexy-args is a simple library and DSL for:

* Handling optional parameters.
* Enforcing types.
* Handling default values.

sexy-args enforces sane defaults:

* Arrays default to [].
* Objects default to {}.
* functions default to function() {}.
* Extend is used by default when assigning default values for an object.
* The common optional options, callback, form is used by default:

So,

```javascript
exports.func = function(options, callback) {
    if (typeof(options) === 'function') {
        callback = options;
        options = {};
    }
	callback = callback || function() {};
}
```

Becomes:

```javascript
exports.func = function(options, callback) {
	sexy.args([this], function() {
		
	});
}
```

A World With Sexy Arguments
---------------------------

Here's what those prior examples would look like if they were using sexy-args:

*Karait*

```javascript
exports.Queue = function(params, onQueueReady) {
	sexy.args([this, ['object1', 'function1'], 'function1'], {
		object1: {
			host: 'localhost',
			port: 27017,
			database: 'karait',
			queue: 'messages',
			averageMessageSize: 8192,
			queueSize: 4096
		}
	}, function() {
		
	});
}
```

*Express*

```javascript
res.sendfile = function(path, options, fn){
	sexy.args([this, 'string1', ['object1', 'function1'], 'function1'], function() {
		var self = this,
			req = self.req,
			next = this.req.next;
	});
};
```

*JSDom*

```javascript
exports.jQueryify = exports.jsdom.jQueryify = function (window, path, callback) {
	sexy.args([this, 'object1', ['string1', 'function1'], 'function1'], function() {
		var jQueryTag = window.document.createElement("script");
	});
}
```

I think this is much cleaner, which is the goal of sexy-args. Why repeat ourselves all the time when creating libraries?

Contributing to sexy-args
----------------------
 
* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it
* Fork the project
* Start a feature/bugfix branch
* Commit and push until you are happy with your contribution
* Make sure to add tests for it. This is important so I don't break it in a future version unintentionally.
* Please try not to mess with the Rakefile, version, or history. If you want to have your own version, or is otherwise necessary, that is fine, but please isolate to its own commit so I can cherry-pick around it.

Copyright
---------

Copyright (c) 2011 Attachments.me. See LICENSE.txt for
further details.