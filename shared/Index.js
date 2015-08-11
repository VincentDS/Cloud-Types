Entry     = require('./Entry'),
Keys      = require('./Keys'),
Fields    = require('./Fields');

//constructor
function Index(name, keys, fields) {
    this.tag = 'index';
    this.name = name;
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

Index.prototype.serializable = function() {
    return {
        name: this.name,
        keys: this.keys.serializable(),
        fields: this.fields.serializable(),
    }
};

Index.deserializable = function (name, json, state) {
    var index = new Index(name, json.keys, json.fields);
    index.state = state;
    return index;
}



module.exports = Index;