
//constructor
function CloudType (field, entry) {
    this._field = field;
    this._entry = entry;
    return this;
}

//methods
CloudType.prototype.field = function() {
    return this._field;
}


module.exports = CloudType;