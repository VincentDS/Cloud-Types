CloudType = require('./CloudType');


//constructor
function CloudString() {
    this.value = '';
    return this;
}

//inherits from CloudType
CloudString.prototype = Object.create(CloudType.prototype);

//methods
CloudString.prototype.get = function() {
    return this._value;
}

CloudString.prototype.set = function(arg) {
    if (typeof arg == 'string') {
        this.value = arg;
        return this;
    }
    else
        throw "argument must be a string";
}

CloudString.prototype.setIfEmpty = function(arg) {
    if (typeof arg == 'string') {
        if(this.value == '') {
            this.value = arg;
        }
        return this;
    }
    else
        throw "argument must be a string";
}


module.exports = CloudString;