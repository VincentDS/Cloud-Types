var io    = require('socket.io-client'),
    State = require('../shared/State'),
    Round = require('../shared/Round'),
    StateManager = require('../shared/StateManager');

function Client() {
    this.stateManager = new StateManager();
    this.initiliazed =  false;
}

Client.prototype.connect = function(url, callback) {
    var socket = io(url);
    socket.on('connect', function(){
        console.log('Connected with the server!');

        socket.on('init', function (json) {
            var state = State.deserializable(json, this.stateManager)
            this.stateManager.state = state;
            this.initiliazed = true;
            callback(this.stateManager);
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