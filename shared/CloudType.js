_ = require('underscore');
//constructor
function CloudType(field, entry) {
    this.tag = 'cloudtype'
    this.field = field;
    this.entry = entry;

    //private members
    var fieldid = entry.index.name+'<'+entry.keys[Object.keys(entry.keys)[0]]+'>'+field+JSON.stringify(entry.keys)+JSON.stringify(entry.index.keys)+JSON.stringify(entry.index.fields);
    var fields = entry.index.state.fields;


    //privileged methods
    this.getValue = function() {
        return (_.has(fields, fieldid)) ? fields[fieldid] : false;
    }

    this.setValue = function(value) {
        fields[fieldid] = value;
    }

    this.deleteEntry = function() {
        delete fields[fieldid];
    }

    this.existEntry = function() {
        return _.has(fields, fieldid);
    }

    this.applyRounds = function() {
        //get value of the cloudtype in the base
        var basevalue =  (_.has(fields, fieldid)) ? fields[fieldid] : false;
        var client = this.entry.index.state.client;

        //we have to take the current en unconfirmed rounds into account.
        var unconfirmedRounds = client.unconfirmed
        var unconfirmedValue = basevalue;

        //update basevalue with operations in the unconfirmed rounds
        unconfirmedRounds.forEach(function(round) {
            unconfirmedValue = round.delta.apply(fieldid, unconfirmedValue);
        })

        //update previous value with the operations in the current round
        var currentRound = client.current
        var confirmedValue = currentRound.delta.apply(fieldid, unconfirmedValue);

        return confirmedValue;
    }

    this.updateRound = function(operation) {
        var curRound = this.entry.index.state.client.current;
        curRound.delta.update(fieldid, operation);
        //put dummy value in fields
        var basevalue = (isNaN(operation.value))? '' : 0;
        if (!this.existEntry()) {
            this.setValue(basevalue);
        }
    }

}

CloudType.prototype.setValue = function(value) {
        fields[fieldid] = value;
    }

//methods
CloudType.prototype.isCloudType = function(CType) {
    return (CType.tag == 'cloudtype');
}


module.exports = CloudType;
