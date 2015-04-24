CloudTypes = require('./server/Server');


var server = CloudTypes.Server;

var groceries = new CloudTypes.Index([{name: 'string'}], {toBuy: 'CInt'});
server.declare('groceries', groceries);


//server.start();



