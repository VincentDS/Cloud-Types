
//constructor
function CloudType (field, entry) {
    //TODO: check if arguments are correct type
    tag = 'cloudtype'
    this._field = field;
    this._entry = entry;
    return this;
}

//methods
CloudType.prototype.field = function() {
    return this._field;
}

CloudType.prototype.isCloudType = function(CType) {
    return (CType.tag == 'cloudtype');
}


module.exports = CloudType;
