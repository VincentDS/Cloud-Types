_ = require('underscore');

//constructor
function CloudType(field, entry) {
    this.tag = 'cloudtype'
    this.field = field;
    this.entry = entry;

    //private members
    var fieldid = field+JSON.stringify(entry.keys)+JSON.stringify(entry.index.keys)+JSON.stringify(entry.index.fields);
    var fields = entry.index.state.fields;

    //privileged methods
    this.getValue = function() {
        return (_.has(fields, fieldid)) ? fields[fieldid] : false;
    }
    this.setValue = function(value) {
        fields[fieldid] = value;
    }
    this.deleteEntry = function() {
        delete fields[fieldid];
    }
    this.printFields = function() {
        console.log(fields);
    }
}

//methods
CloudType.prototype.isCloudType = function(CType) {
    return (CType.tag == 'cloudtype');
}



module.exports = CloudType;
