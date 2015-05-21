//Operations are store in delta objects.
function Operation(operator, value) {
    this.tag = 'operation';
    this.operator = operator;
    this.value = value;
}

Operation.prototype.serializable = function() {
    return {
        operator: this.operator,
        value: this.value
    }
};

Operation.deserializable = function(json) {
    var operation = new Operation();
    var parsed = json //JSON.parse(json);
    operation.operator = parsed.operator;
    operation.value = parsed.value;
    return operation;
}

module.exports = Operation;
