Sexy Arguments
==============

Motivation
----------

I was working on one of my Node.js libraries and noticed I was doing something silly:

* Karait (https://github.com/bcoe/karait)

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

What a ton of ritual around dealing with optional and default parameters when declaring methods!

I then did a little bit of a literature review, here's some examples:

* Node MongoDB Native (https://github.com/christkv/node-mongodb-native)

```javascript
Collection.prototype.insertAll = function insertAll (docs, options, callback) {
  if('function' === typeof options) callback = options, options = {};  
  if(options == null) options = {};
  if(!('function' === typeof callback)) callback = null;
}
```

* Express (https://github.com/visionmedia/express)

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

* JSDom (https://github.com/tmpvar/jsdom)

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

We're all reinventing the wheel!

The Solution, Sexy Arguments
----------------------------