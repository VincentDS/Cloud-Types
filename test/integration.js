CServer = require('../server/Server');
CClient = require('../client/Client');


var server = CServer.Server;
var client = CClient.Client;


var groceries = new CServer.Index([{name: 'string'}], {toBuy: 'CInt', country: 'CString'});
server.declare('groceries', groceries);

server.start();
client.connect('http://localhost:8080');
