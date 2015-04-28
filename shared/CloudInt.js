CloudType = require('./CloudType');


//constructor
function CloudInt() {
    this.value = 0;
    return this;
}

//inherits from CloudType
CloudInt.prototype = Object.create(CloudType.prototype);

//methods
CloudInt.prototype.get = function() {
    //helemaal naar boven gaan, entry, index, field. en uit field de juiste waarde halen door hash te maken van combinatie van deze velden
    return this.value;
}

CloudInt.prototype.set = function(arg) {
    if (typeof arg == 'number') {
        this.value = arg;
        return this;
    }
    else
        throw "argument must be a number";
}

CloudInt.prototype.add = function(arg) {
    if (typeof arg == 'number') {
        this.value += arg;
        return this;
    }
    else
        throw "argument must be a number";
}


module.exports = CloudInt;