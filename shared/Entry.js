CloudType   = require('./CloudType'),
CloudInt    = require('./CloudInt'),
CloudString = require('./CloudString');

//constructor
function Entry(index, keys) {
    this.tag = 'entry';
    this.index = index;
    this.keys = keys;
    return this;
}

Entry.prototype.get = function(field) {
    var type = this.index.fields.fieldType(field)
    if (type == 'CInt') {
        return new CloudInt(field, this);
    } else if (type == 'CString') {
        return new CloudString(field, this);
    } else {
        throw "invalid field";
    }
}

Entry.prototype.key = function(name) {
    if (typeof this.keys[name] !== 'undefined') {
        return this.keys[name];
    }
    else
        throw "invalid key";
}

module.exports = Entry;