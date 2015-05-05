_ = require('underscore');


//{amount: 'CInt', price : 'CInt'}
function Fields(fields) {
    this.fields = fields;
}

Fields.prototype.fieldType = function(field) {
    if (_.has(this.fields, field)) {
        return this.fields[field];
    }
};

 Fields.prototype.serializable = function() {
    return this.fields;
 };

module.exports = Fields;