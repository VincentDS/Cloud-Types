Entry     = require('./Entry'),
Validator = require('../lib/utils');

//constructor
function Index(keys, fields) {
    //TODO; check if valid fields
    this.validKeys(keys);
    //if (!Validator.validKeys(keys)) throw 'invalid keys';
    //if (!Validator.validFields(fields)) throw 'invalid fields';
    this.tag = 'index';
    this._keys = keys;
    this._fields = fields;
    return this;
}

Index.prototype.get = function(keys) {
    if (validKeys(keys)) {
        return new Entry(this, keys);
    } else
        throw 'keys must be array of strings/numbers';
};

Index.prototype.entries = function(key) {
    // body...
};


Index.prototype.validKeys = function(keys) {
};


module.exports = Index;