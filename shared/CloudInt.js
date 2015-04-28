CloudType = require('./CloudType');


//constructor
function CloudInt(field, entry) {
    CloudType.call(this, field, entry);
    return this;
}

//inherits from CloudType
CloudInt.prototype = Object.create(CloudType.prototype);

//methods
CloudInt.prototype.get = function() {
    return (this.getValue()) ? this.getValue() : 0;
}

CloudInt.prototype.set = function(arg) {
    if (typeof arg == 'number') {
        (arg != 0)? this.setValue(arg) : this.deleteEntry();
    }
    else
        throw "argument must be a number";
}

CloudInt.prototype.add = function(arg) {
    if (typeof arg == 'number') {
        var result = this.get() + arg;
        this.set(result);
    }
    else
        throw "argument must be a number";
}


module.exports = CloudInt;