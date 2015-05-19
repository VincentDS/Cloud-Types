//Operations are store in delta objects.
function Operation(operator, value) {
    this.tag = 'operation';
    this.operator = operator;
    this.value = value;
}

module.exports = Operation;
