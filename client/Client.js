var io    = require('socket.io-client'),
    State = require('../shared/State'),
    Round = require('../shared/Round');

function Client() {
    this.state;
    this.unconfirmed = [];
    this.current =  new Round(this, 1);
    this.initiliazed =  false;
}

Client.prototype.connect = function(url, callback) {
    var socket = io(url);
    socket.on('connect', function(){
        console.log('Connected with the server!');

        socket.on('init', function (json) {
            this.state = State.deserializable(json);
            this.state.client = this;
            this.initiliazed = true;
            callback(this.state);
        }.bind(this));


    }.bind(this));
};

Client.prototype.yield = function() {
    // body...
};





module.exports = {
    Client: new Client(),
    Index: Index
}