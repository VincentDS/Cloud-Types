CloudTypes = require('./../../../server/Server');


var server = CloudTypes.Server;

server.declare('groceries', new CloudTypes.Index([{name: 'string'}], {toBuy: 'CInt'}));

server.start();