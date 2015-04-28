
//constructor
function CloudType(field, entry) {
    this.tag = 'cloudtype'
    this.field = field;
    this.entry = entry;
    this.fieldid;
    return this;
}

//methods
CloudType.prototype.isCloudType = function(CType) {
    return (CType.tag == 'cloudtype');
}


module.exports = CloudType;
