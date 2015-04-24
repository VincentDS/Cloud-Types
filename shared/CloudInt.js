CloudType = require('./CloudType');


//constructor
function CloudInt(value) {
    //TODO: check if argument is correct type
    this._value = value;
    return this;
}

//inherits from CloudType
CloudInt.prototype = Object.create(CloudType.prototype);

//methods
CloudInt.prototype.get = function() {
    //helemaal naar boven gaan, entry, index, field. en uit field de juiste waarde halen door hash te maken van combinatie van deze velden
    return this._value;
}

CloudInt.prototype.set = function(arg) {
    if (typeof arg == 'number') {
        this._value = arg;
        return this;
    }
    else
        throw "argument must be a number";
}

CloudInt.prototype.add = function(arg) {
    if (typeof arg == 'number') {
        this._value += arg;
        return this;
    }
    else
        throw "argument must be a number";
}


module.exports = CloudInt;