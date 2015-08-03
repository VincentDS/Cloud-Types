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

        var client = new CClient.Client(false);
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

        it.skip('testing cloudstrings', function(done){
            var client = new CClient.Client(false);
            client.connect('http://localhost:8080', function(state) {
                var value1 = 'belgium';
                var value2 = 'france';
                var index = state.get('groceries');
                var entry = index.get('apples');
                var cloudstring = entry.get('country');
                cloudstring.set(value1);
                cloudstring.get().should.equal(value1);
                cloudstring.setIfEmpty(value2);
                cloudstring.get().should.equal(value1);
                cloudstring.set(value2);
                cloudstring.get().should.equal(value2);
                done();
            })
        })

        it.skip('yielding with one client', function(done){
            this.timeout(5000);
            var client = new CClient.Client(false);
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

        it.skip('yielding with two clients', function(done){
            this.timeout(10000);
            var client1 = new CClient.Client(false);
            var client2 = new CClient.Client(false);
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

        it.skip('offline availability, reconnecting and sending changes', function(done) {
            this.timeout(5000);
            var client = new CClient.Client(false);
            var initialState;
            client.connect('http://localhost:8080', function(state) {
                initialState = state;
                client.socket.connected.should.be.true;
                //disconnect client
                client.disconnect();
                client.socket.connected.should.be.false;

                var index = state.get('groceries');
                var entry = index.get('apples');
                var cloudint = entry.get('toBuy');
                cloudint.get().should.be.equal(50);
                cloudint.add(15);
                //try to yield, while offline (does nothing)
                client.yield();

                //base value of server must still be the same
                _.isEqual(initialState, state).should.be.true;

                //reconnect to the server
                client.connect('http://localhost:8080', function(state) {
                    client.yield();
                    //wait for server to process the round
                    setTimeout(function () {
                        //check base value of client
                        state.get('groceries').get('apples').get('toBuy').getValue().should.be.equal(65);
                        done();
                    }, 3000)
                })
            });

        })

        it.skip('Using \'yieldUpdate\', only update state when yielding. State between two yields is guaranteed to be consistent', function(done) {
            this.timeout(5000);
            var client1 = new CClient.Client(true);
            var client2 = new CClient.Client(false);
            client1.connect('http://localhost:8080', function(state1) {
                var index1 = state1.get('groceries');
                var entry1 = index1.get('apples');
                var cloudint1 = entry1.get('toBuy');
                cloudint1.set(5);

                //state must be consistent between this yield...**
                client1.yield();

                client2.connect('http://localhost:8080', function(state2) {
                    var index2 = state2.get('groceries');
                    var entry2 = index2.get('apples');
                    var cloudint2 = entry2.get('toBuy');

                    cloudint2.add(10);
                    client2.yield();
                    //client2 yielding and sending changes to the server so client1 receives it
                    setTimeout(function () {
                        //client1 may not process the changes of client2 yet
                        cloudint1.get().should.be.equal(5);

                        //**...and this yield
                        client1.yield();

                        //after the yield, client1 must have the change of client2
                        cloudint1.get().should.be.equal(15);
                        done();
                    }, 3000)
                });
            });

        })


        it('flushing', function(done) {
            this.timeout(3000);
            var client = new CClient.Client(true);
            client.connect('http://localhost:8080', function(state) {
                var index = state.get('groceries');
                var entry = index.get('apples');
                var cloudint = entry.get('toBuy');
                cloudint.set(100);
                cloudint.getValue().should.not.be.equal(100);
                client.flush(function() {
                    cloudint.get().should.be.equal(100);
                    done();
                });
            });

        })

    })

})


