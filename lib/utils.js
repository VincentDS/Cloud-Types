CloudType = require('../shared/CloudType');

function Validator() {}


Validator.prototype.validKeys = function(keys) {
    var valid = true;
    if (keys instanceof Array) {
        keys.forEach(function(key) {
            if (typeof key !== 'number' && typeof key !== 'string')
                valid = false;
            });
    } else
        valid = false;
    return valid;
};

Validator.prototype.validFields = function(fields) {
    var valid = true;
    if (fields instanceof Array) {
        fields.forEach(function(field) {
            if (!CloudType.isCloudType(field))
                valid = false;
            });
    } else
        valid = false;
    return valid;
};


module.exports = Validator;