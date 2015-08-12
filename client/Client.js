var io    = require('socket.io-client'),
    State = require('../shared/State'),
    Round = require('../shared/Round'),
    LogSegment = require('../server/LogSegment'),
    LogTail = require('../server/LogTail');

function Client(yieldUpdate) {
    this.id;
    this.state;
    this.unconfirmed = [];
    this.received = [];
    this.current;
    this.initiliazed =  false;
    this.socket;
    this.yieldUpdate = yieldUpdate;

    this.commit = function(cb) {
        if (!this.current.isEmpty()) {
            //send current to the server
            this.socket.emit('round', {round: JSON.stringify(this.current.serializable())})

            //add current to unconfirmed rounds
            this.unconfirmed.push(this.current)
            //refresh current round
            this.current = new Round(this.id, this.current.number+1)

            if (typeof cb === 'function') {
                cb();
            }
        }
    };

    this.adjustConfirmed = function(maximum) {

        //delete all rounds in unconfirmed until the maximum number
        while (this.unconfirmed.length !== 0 && maximum >= this.unconfirmed[0].number) {
            this.unconfirmed.shift();
        }
    }

    this.resendUnconfirmed = function() {
        this.unconfirmed.forEach(function (round) {
            this.socket.emit('round', {round: JSON.stringify(round.serializable())})
        })
    }

    this.processSegments = function (roundnumber, cb) {
        this.received.forEach(function(logSegment) {
            //apply delta of logsegment to the client's base
            this.state.apply(logSegment.delta);
            maxRound = logSegment.maxround[this.id];
            //delete unconfirmed rounds that are part of this logsegment
            this.adjustConfirmed(maxRound);
        }.bind(this));
        //All logsegments have been processed, empty the array (forEach is synchronous)
        this.received = []

        //for flushing
        if (typeof cb === 'function') {
            //check if commited round is processed by the server and sent back
            if (typeof maxRound === 'undefined' || roundnumber > maxRound) {
                //no? try again until the round is processed and sent back
                setTimeout(this.processSegments.bind(this), 500, roundnumber, cb);
            } else {
                //round is processed and sent back
                cb();
            }
        }
    }
}

Client.prototype.connect = function(url, callback) {
    this.socket = io.connect(url, {'forceNew': true });
    this.socket.on('connect', function() {

        //First connection with the server
        if (!this.initiliazed)  {
            this.socket.emit('init', function (init) {
                this.id = init.id;
                this.current =  new Round(this.id, 1);
                this.state = State.deserializable(init.state);
                this.state.client = this;
                this.initiliazed = true;
                callback(this.state);
            }.bind(this));
        } else { //Already has been connected to the server
            this.socket.emit('reconnection', function (reconnect) {
                var logTail = LogTail.deserializable(reconnect.logtail);
                //replace base state
                this.state = logTail.state
                this.state.client = this;
                //delete unconfirmed rounds that are already part of the logtail
                this.adjustConfirmed(logTail.maxround[this.id]);
                //resend unconfirmed rounds
                this.resendUnconfirmed();
                callback(this.state);
            }.bind(this));
        }

        this.socket.on('update', function (logSegment) {
            var logSegment = LogSegment.deserializable(logSegment);
            //add logsegment to the received logsegment list
            this.received.push(logSegment);
            if (!this.yieldUpdate) {
                //process received logsegments
                this.processSegments();
            }
        }.bind(this));


    }.bind(this));
};

//yield commits the current and receives and receives logsegments form the server
Client.prototype.yield = function() {
    if (this.socket.connected) {
        //commit current round
        this.commit();
        if (this.yieldUpdate) {
            //process received logsegments
            this.processSegments();
        }
    } else {
        //client is disconnected from the server
    }
};

Client.prototype.flush = function(callback) {
    var roundNumber = this.current.number;
    //commit round and wait until server sends the processed round back
    this.commit(function() {
        this.processSegments(roundNumber, function() {
            callback();
        });
    }.bind(this));
};

Client.prototype.disconnect = function() {
    this.socket.disconnect();
};



module.exports = {
    Client: Client,
    Index: Index
}