_ = require('underscore');

//constructor
function CloudType(field, entry) {
    this.tag = 'cloudtype'
    this.field = field;
    this.entry = entry;

    //private members
    var fieldid = field+JSON.stringify(entry.keys)+JSON.stringify(entry.index.keys)+JSON.stringify(entry.index.fields);
    var fields = entry.index.state.fields;

    //privileged methods
    this.getValue = function() {
        //get value of the cloudtype in the base
        var basevalue =  (_.has(fields, fieldid)) ? fields[fieldid] : false;
        var stateManager = this.entry.index.state.stateManager;

        //we have to take the current en unconfirmed rounds into account.

        var unconfirmedRounds = stateManager.unconfirmed
        var unconfirmedValue = basevalue;

        //update basevalue with operations in the unconfirmed rounds
        unconfirmedRounds.forEach(function(round) {
            unconfirmedValue = round.delta.apply(fieldid, unconfirmedValue);
        })

        //update previous value with the operations in the current round
        var currentRound = stateManager.current
        var confirmedValue = unconfirmedValue;
        currentRound.delta.apply(fieldid, confirmedValue);

        return confirmedValue;

    }

    this.setValue = function(value) {
        fields[fieldid] = value;
    }
    this.deleteEntry = function() {
        delete fields[fieldid];
    }
    this.printFields = function() {
        console.log(fields);
    }
}


//methods
CloudType.prototype.isCloudType = function(CType) {
    return (CType.tag == 'cloudtype');
}


module.exports = CloudType;
