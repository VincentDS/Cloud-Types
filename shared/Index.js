Entry     = require('./Entry'),
Keys      = require('./Keys'),
Fields    = require('./Fields');

//constructor
function Index(keys, fields) {
    this.tag = 'index';
    this.state;
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

Index.prototype.serializable = function() {
    return {
        keys: this.keys.serializable(),
        fields: this.fields.serializable(),
    }
};

Index.deserializable = function (json, state) {
    var index = new Index(json.keys, json.fields);
    index.state = state;
    return index;
}



module.exports = Index;