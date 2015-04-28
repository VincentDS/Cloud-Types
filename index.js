CloudTypes = require('./server/Server');


var server = CloudTypes.Server;

var groceries = new CloudTypes.Index([{name: 'string'}], {toBuy: 'CInt', country: 'CString'});
server.declare('groceries', groceries);

var apples = groceries.get('apples');

var toBuy = apples.get('toBuy');

server.start();



