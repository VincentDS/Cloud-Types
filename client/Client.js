var io    = require('socket.io-client'),
    State = require('../shared/State');

function Client() {

}

Client.prototype.connect = function(url, callback) {
    var socket = io(url);
    socket.on('connect', function(){
        console.log('Connected with the server!');

        socket.on('init', function (json) {
            var state = State.deserializable(json)
            callback(state);
        });
    });
};



module.exports = {
    Client: new Client(),
    Index: Index
}