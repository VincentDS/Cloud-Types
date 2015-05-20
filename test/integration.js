CServer = require('../server/Server');
CClient = require('../client/Client');


var server = CServer.Server;
var client = CClient.Client;


var groceries = new CServer.Index([{name: 'string'}], {toBuy: 'CInt', country: 'CString'});
server.declare('groceries', groceries);

var apples = groceries.get('apples');
var toBuy = apples.get('toBuy');
toBuy.setValue(5);


server.start();

client.connect('http://localhost:8080', function(state) {
    var groceries = state.get('groceries');
    var apples = groceries.get('apples');
    var toBuy = apples.get('toBuy');
    console.log(toBuy.get());

    toBuy.add(9);
    toBuy.add(3);
    toBuy.add(10);
    toBuy.add(50);
    console.log(toBuy.get());
    console.log(client.current.delta);

});


