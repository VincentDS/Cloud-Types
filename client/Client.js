var io    = require('socket.io-client'),
    State = require('../shared/State'),
    Round = require('../shared/Round'),
    LogSegment = require('../server/LogSegment');

function Client() {
    this.id;
    this.state;
    this.unconfirmed = [];
    this.current;
    this.initiliazed =  false;
    this.socket;

    this.commit = function() {
        //send current to the server
         this.socket.emit('yield', {round: JSON.stringify(this.current.serializable())})

        //add current to unconfirmed rounds
        this.unconfirmed.push(this.current)
        //refresh current round
        this.current = new Round(this.id, this.current.number+1)
    };

    this.adjustConfirmed = function(maximum) {

        //delete all rounds in unconfirmed until the maximum number
        while (this.unconfirmed.length !== 0 && maximum >= this.unconfirmed[0].number) {
            this.unconfirmed.shift();
        }
        //console.log(this.state);
    }
}

Client.prototype.connect = function(url, callback) {
    this.socket = io.connect(url, {'forceNew': true });
    this.socket.on('connect', function() {

        if (!this.id)  {
            //console.log('First connection with the server!');
            this.socket.emit('init', function (init) {
                this.id = init.id;
                this.current =  new Round(this.id, 1);
                this.state = State.deserializable(init.state);
                this.state.client = this;
                this.initiliazed = true;
                callback(this.state);
            }.bind(this));
        } else {
            //console.log('Already has been connected to the server');
            this.socket.emit('reconnection', function (reconnect) {
                this.state = State.deserializable(reconnect.state);
                this.state.client = this;
                callback(this.state);
            }.bind(this));
        }

        this.socket.on('update', function (logSegment) {
            var logSegment = LogSegment.deserializable(logSegment);
            //console.log('client ' + this.id + ' received segment : ' + logSegment);
            //apply delta of logsegment to the client's base
            this.state.apply(logSegment.delta);
            //delete unconfirmed rounds that are part of this logsegment
            this.adjustConfirmed(logSegment.maxround[this.id]);
        }.bind(this));


    }.bind(this));
};

//yield commits the current and receives and receives logsegments form the server
Client.prototype.yield = function() {
    if (this.socket.connected) {
        this.commit();
    };
};

Client.prototype.disconnect = function() {
    this.socket.disconnect();
};



module.exports = {
    Client: Client,
    Index: Index
}