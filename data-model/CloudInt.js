CloudType = require('CloudType');


//constructor
function CloudInt(value) {
    this._value = value;
}

//inherits from CloudType
CloudInt.prototype = Object.create(CloudType.prototype);

//methods
CloundInt.prototype.get = function() {
    return this._value;
}

CloundInt.prototype.set = function(arg) {
    if (typeof arg == 'number') {
        this._value = arg;
        return this;
    }
    else
        throw "argument must be a number"
}

CloundInt.prototype.add = function(arg) {
    if (typeof arg == 'number') {
        this._value += arg;
        return this;
    }
    else
        throw "Argument must be a string"
}


module.exports = CloudInt;