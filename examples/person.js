var sexy = require('../lib/index'),
    puts = require('util').puts;

function Person(attributes) {
    sexy.args(
        [this, 'object1'], 
        {
            'object1': {
                'alive': true
            }
        },
        function() {
            this.transportation = 'walking';
            sexy.extend(this, attributes);
        }
    );
}

Person.prototype.updateInformation = function(name, age, attributes) {
    sexy.args([this, ['string1', 'number1', 'object1'], ['number1', 'object1'], 'object1'], function() {
        this.age = age || this.age;
        this.name = name || this.name;
        sexy.extend(this, attributes, {'Does he like turtles?': true});
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

ben.updateInformation(28);
ben.updateInformation('Benjamin Coe', {
   hobbies: ['climbing']
});

ben.print();