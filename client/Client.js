var io    = require('socket.io-client'),
    State = require('../shared/State'),
    Round = require('../shared/Round');

function Client() {
    this.id;
    this.state;
    this.unconfirmed = [];
    this.current;
    this.initiliazed =  false;
    this.socket;

    this.commit = function() {
        //send current to the server
         this.socket.emit('yield', this.current , function (res) {
            'received some yield answer';
        }.bind(this));

        //add current to unconfirmed rounds
        this.unconfirmed.push(this.current)
        //refresh current round
        this.current = new Round(this.id, this.current.number+1)
    }
}

Client.prototype.connect = function(url, callback) {
    this.socket = io(url);
    this.socket.on('connect', function(){

    if (!this.id)  {
        console.log('First connection with the server!');
        this.socket.emit('init', function (init) {
            this.id = init.id;
            this.current =  new Round(this.id, 1);
            this.state = State.deserializable(init.state);
            this.state.client = this;
            this.initiliazed = true;
            callback(this.state);
        }.bind(this));
    }

    if (this.id) {
        console.log('Already has been connected to the server');
    }


    }.bind(this));
};

//yield commits the current and receives and receives logsegments form the server
Client.prototype.yield = function() {
    if (this.socket.connected) {
        this.commit();
    };
};





module.exports = {
    Client: new Client(),
    Index: Index
}