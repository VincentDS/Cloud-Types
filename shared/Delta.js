Operation = require('./operation');

//collection of updates,
//maintains a hashmap with fields mapping on a operation.
function Delta() {
    this.tag = 'delta';
    this.updated = {};
}

//updates on the delta object
Delta.prototype.update = function(key, operation) {
    if (operation.tag !== 'operation') throw 'invalid operation';
    if (!(key in this.updated)) {
        this.updated[key] = operation;
    } else {
        switch(operation.operator) {
            case 'set': //last writer wins
                this.updated[key] = operation;
                break;
            case 'add': //add new amount to old value, maintain the operator
                this.updated[key].value += operation.value;
                break;
            case 'setifempty':
                //only do something if value is empty
                //'setifempty operation becomes set'
                if (this.updated[key].value == '')
                    this.updated[key] = new Operation('set', operation.value)
                break;
        }
    }
};

//apply the delta object on a specific value
Delta.prototype.apply = function(key, value) {
    if (key in this.updated) {
        //console.log('key found in this delta!');
        var operation = this.updated[key];
        switch(operation.operator) {
            case 'set':
                value = operation.value;
                break;
            case 'add':
                value += operation.value;
                break;
        }

    }
    return value;
};

//append two delta objects
Delta.prototype.append = function(delta) {
    for (var key in delta.updated) {
        this.update(key, delta.updated[key])
    }
};

module.exports = Delta;
