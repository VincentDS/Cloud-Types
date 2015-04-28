Entry     = require('./Entry'),
Validator = require('../lib/utils'),
Keys      = require('./Keys'),
Fields    = require('./Fields');

//constructor
function Index(keys, fields) {
    this.tag = 'index';
    this.keys = new Keys(keys);
    this.fields = new Fields(fields);
    return this;
}

Index.prototype.get = function() {
    var keyvalues = this.keys.keyValues(arguments)
    if (keyvalues) {
        return new Entry(this, keyvalues);
    } else
        throw 'invalid keys';
};

Index.prototype.entries = function(key) {
    // body...
};



module.exports = Index;