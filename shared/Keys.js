//[{name: 'string'}, {amount: 'number'}]
function Keys(keys) {
    var that = this;
    this.keys = keys;
    this.names = [];
    this.types = [];
    keys.forEach(function(key) {
        subkey = Object.keys(key)[0];
        that.names.push(subkey);
        that.types.push(key[subkey]);
    })
}

//expects multiple parameters
 Keys.prototype.keyValues = function(arg) {
    var res = {};
    if (arg.length != this.types.length) throw 'Invalid amount of keys, please provide ' + this.types.length;
    for (i = 0; i < arg.length; i++) {
        if (typeof arg[i] !== this.types[i]) throw 'Invalid type ' + arg[i];
        res[this.names[i]] = arg[i];
    }
    return res;
 };


 Keys.prototype.serializable = function() {
    return this.keys;
 };

module.exports = Keys;
