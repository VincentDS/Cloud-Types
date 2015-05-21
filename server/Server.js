var io      = require('socket.io')(),
    LogTail = require('./LogTail'),
    LogSegment = require('./LogSegment');


function Server() {
    this.io = io;
    this.logTail = new LogTail();
    this.clientcount = 0;
    this.curSegment = new LogSegment();

    this.receiveRound = function(round) {
        this.curSegment.append(round);
        //console.log(this.curSegment);
    }

    this.processSegment = function() {
        console.log('processing LogSegment...');
        this.logTail.apply(this.curSegment);
        this.curSegment = new LogSegment();
    }

    setInterval(this.processSegment.bind(this), 2000);

}


Server.prototype.declare = function(name, collection) {
    if (collection.tag == 'index' || collection.tag == 'table') {
        this.logTail.state.add(name, collection);
    } else
        throw 'Invalid collection';
};

Server.prototype.start = function(port) {

    port = (typeof port === 'undefined') ? 8080 : port;
    io.listen(port);
    console.log('Server running on port ' + port + '...');

    io.on('connection', function (socket) {
        console.log('Client connected!');

        //send state tot connected client
        socket.on('init', function (initClient) {
            initClient({id: ++this.clientcount, state: JSON.stringify(this.logTail.state.serializable())});
        }.bind(this));

        socket.on('yield', function (round) {
            console.log('server received round from client ' + round.client);
            this.receiveRound(round)
        }.bind(this));

    }.bind(this));

};

Server.prototype.stop = function() {
    io.close();
    console.log('Server closed');
};



module.exports = {
    Server: new Server(),
    Index: Index
}