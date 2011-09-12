var sexy = require('sexy-args'),
    puts = require('sys').puts;

function extend(obj1, obj2) {
    for (var key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            obj1[key] = obj2[key];
        }
    }
}

function Person(attributes) {
    sexy.args([this, 'object1'], function() {
        extend(this, attributes);
    });
}

Person.prototype.updateInformation = function(name, age, attributes) {
    sexy.args([this, ['string1', 'number1', 'object1'], ['number1', 'object1'], 'object1'], function() {
        this.age = age || this.age;
        this.name = name || this.name;
        extend(this, attributes);
    });
};

Person.prototype.print = function() {
    for (var key in this) {
        if (this.hasOwnProperty(key) && typeof(this[key]) !== 'function') {
            puts(key + ': ' + this[key]);
        }
    }
};

var ben = new Person({
    name: 'Benjamin'
});

ben.updateInformation(27);
ben.updateInformation('Benjamin Coe', {
   hobbies: ['climbing']
});

ben.print();