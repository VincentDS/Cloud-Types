var io      = require('socket.io')(),
    LogTail = require('./LogTail');


function Server() {
    this.io = io;
    this.logtail = new LogTail();
}


Server.prototype.declare = function(name, collection) {
    if (collection.tag == 'index' || collection.tag == 'table') {
        this.logtail.state.add(name, collection);
    } else
        throw 'Invalid collection';
};

Server.prototype.start = function(port) {
    that = this;
    port = (typeof port === 'undefined') ? 8080 : port;
    io.listen(port);
    console.log('Server running on port ' + port + '...');

    io.on('connection', function (socket) {
        console.log('Client connected!');

        //send state tot connected client
        io.emit('init', JSON.stringify(that.logtail.state.serializable()));
    });

};

Server.prototype.stop = function() {
    io.close();
    console.log('Server closed');
};


module.exports = {
    Server: new Server(),
    Index: Index
}