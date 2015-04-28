Index = require('./Index');

function State() {
    this.tag = 'state';
    //hashmap fieldid to values
    this.fields = {};
    //collections dictionary (indexes/tables)
    this.collections = {};
}

State.prototype.get = function(name) {
    if (typeof this.collections[name] !== 'undefined') {
        return this.collections[name];
    } else
        throw "This collection does not exists";
};

State.prototype.add = function(name, collection) {
    if (typeof this.collections[name] !== 'undefined') {
        throw "A collection with this name already exists";
    } else {
        if (collection.tag == 'index' || collection.tag == 'table') {
            //add state to the collection
            collection.state = this;
            this.collections[name] = collection
            return collection
        } else
            throw "Invalid collection tag, " + collection.tag;
    }
};


module.exports = State;

