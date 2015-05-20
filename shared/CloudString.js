CloudType = require('./CloudType');


//constructor
function CloudString(field, entry) {
    CloudType.call(this, field, entry);
    return this;
}

//inherits from CloudType
CloudString.prototype = Object.create(CloudType.prototype);

//methods
CloudString.prototype.get = function() {
    var value = this.getValue();
    return (value) ? value : '';
}

CloudString.prototype.set = function(arg) {
    if (typeof arg == 'string') {
        (arg != '')? this.setValue(arg) : this.deleteEntry();
    }
    else
        throw "argument must be a string";
}

CloudString.prototype.setIfEmpty = function(arg) {
    if (typeof arg == 'string') {
        if (this.get() == '') this.set(arg);
    }
    else
        throw "argument must be a string";
}


module.exports = CloudString;