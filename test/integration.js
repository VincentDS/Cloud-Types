var should = require('should'),
    _      = require('underscore'),
CServer = require('../server/Server'),
CClient = require('../client/Client');


var server = CServer.Server;
var client = new CClient.Client();


describe('Integration', function(){

    before(function () {
        server.start();
    });

    after(function () {
        server.stop();
    });

    describe('Server API', function(){

        var index = new CServer.Index([{name: 'string'}], {toBuy: 'CInt', country: 'CString'});

        it('declaring index on the server', function(){
            var indexname = 'groceries'
            server.declare('groceries', index);
            server.logTail.state.collections[indexname].should.equal(index);
        })

        it('setting cloudtype on the server', function(){
            var value = 5;
            var entry = index.get('apples');
            var cloudint = entry.get('toBuy');
            cloudint.setValue(value);
            cloudint.getValue().should.equal(value);
        })

    })

    describe('Client API', function(){

        it('connecting to the server', function(done){
            client.connect('http://localhost:8080', function(state) {
                client.socket.connected.should.be.true
                should.exist(state);
                client.disconnect();
                done();
            });
        })

        it('reconnecting to the server', function(done){
            client.connect('http://localhost:8080', function(state) {
                client.socket.connected.should.be.true
                should.exist(state);
                client.disconnect();
                done();
            });
        })

        it('check received state', function(done){
            client.connect('http://localhost:8080', function(state) {
                _.isEqual(state.fields, server.logTail.state.fields).should.be.true;
                client.disconnect();
                done();
            });
        })

    })

})


