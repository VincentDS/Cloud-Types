CloudType = require('./CloudType');


//constructor
function CloudInt(value) {
    this._value = value;
    return this;
}

//inherits from CloudType
CloudInt.prototype = Object.create(CloudType.prototype);

//methods
CloudInt.prototype.get = function() {
    return this._value;
}

CloudInt.prototype.set = function(arg) {
    if (typeof arg == 'number') {
        this._value = arg;
        return this;
    }
    else
        throw "argument must be a number"
}

CloudInt.prototype.add = function(arg) {
    if (typeof arg == 'number') {
        this._value += arg;
        return this;
    }
    else
        throw "argument must be a number"
}


module.exports = CloudInt;