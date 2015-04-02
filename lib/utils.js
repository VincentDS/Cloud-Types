function validKeys(keys) {
    var valid = true;
    if (keys instanceof Array) {
        keys.forEach(function(key) {
            if (typeof key !== 'number' && typeof key !== 'string')
                valid = false;
            });
    } else
        valid = false;
    return valid;
}
module.exports = validKeys;