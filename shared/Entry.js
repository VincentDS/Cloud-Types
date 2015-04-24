CloudType = require('./CloudType'),
//Index     = require('./Index'),
validKeys = require('../lib/utils');

//constructor
function Entry(index, keys) {
    //TODO; check if index is valid Index
    if (!validKeys(keys)) throw 'keys must be array of strings/numbers';
    this.tag = 'entry';
    this._index = index;
    this._keys = keys;
    return this;
}

Entry.prototype.get = function(field) {
    if (typeof field == 'string') {
        return new CloudType(field, this);
    }
    else
        throw "argument must be a string";
}

Entry.prototype.key = function(name) {
    if (typeof name == 'string' || typeof name == 'number') {
        return; //TODO
    }
    else
        throw "argument must be a string or number";
}

module.exports = Entry;