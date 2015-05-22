var should = require('should'),
    _      = require('underscore'),
CServer = require('../server/Server'),
CClient = require('../client/Client');


var server = CServer.Server;

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

        var client = new CClient.Client();
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

        it('yielding with one client', function(done){
            this.timeout(5000);
            var client = new CClient.Client();
            client.connect('http://localhost:8080', function(state) {
                var index = state.get('groceries');
                var entry = index.get('apples');
                var cloudint = entry.get('toBuy');
                cloudint.get().should.be.equal(5);
                cloudint.add(15);
                client.yield();
                //only checks base
                cloudint.getValue().should.be.equal(5);
                //also checks current en unconfirmed
                cloudint.get().should.be.equal(20);
                setTimeout(function () {
                    //base must be edited by the received logsegment
                    cloudint.getValue().should.be.equal(20);
                    done();
                 }, 3000);
            });
        })

        it('yielding with two clients', function(done){
            this.timeout(10000);
            var client1 = new CClient.Client();
            var client2 = new CClient.Client();
            client1.connect('http://localhost:8080', function(state1) {
                var index1 = state1.get('groceries');
                var entry1 = index1.get('apples');
                var cloudint1 = entry1.get('toBuy');
                cloudint1.set(5);

                client2.connect('http://localhost:8080', function(state2) {
                    var index2 = state2.get('groceries');
                    var entry2 = index2.get('apples');
                    var cloudint2 = entry2.get('toBuy');

                    cloudint1.add(10);
                    client1.yield();
                    setTimeout(function () {
                        cloudint2.get().should.be.equal(15);
                        cloudint2.set(50);
                        client2.yield();
                        setTimeout(function () {
                            cloudint1.get().should.be.equal(50);
                            done();
                        }, 3000)
                    }, 3000)
                });
            });
        })

    })

})


