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

//save delta on the state
Delta.prototype.save = function(fields) {
    for (var key in this.updated) {
        var operation = this.updated[key];
        if (typeof fields[key] != "undefined") {
            switch(operation.operator) {
                case 'set':
                    fields[key] = operation.value;
                    break;
                case 'add':
                    fields[key] += operation.value;
                    break;
            }
        } else {
            fields[key] = operation.value;
        }
        if (fields[key] == 0 || fields[key] == '')
                delete fields[key];
    }
}

//append two delta objects
Delta.prototype.append = function(delta) {
    for (var key in delta.updated) {
        this.update(key, delta.updated[key])
    }
};

Delta.prototype.serializable = function() {
    var serializableOperations = {};
    for (var key in this.updated) {
        serializableOperations[key] = this.updated[key].serializable();
    }
    return {
        updated: serializableOperations,
    }
};

Delta.deserializable = function(json) {
    var delta = new Delta();
    var parsed = json //JSON.parse(json);
    Object.keys(parsed.updated).forEach(function(key) {
        delta.updated[key] = Operation.deserializable(parsed.updated[key]);
    });
    return delta;
}

module.exports = Delta;
