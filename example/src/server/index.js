CloudTypes = require('./../../../server/Server');


var server = CloudTypes.Server;
var indexname = 'groceries';
server.declare(indexname, new CloudTypes.Index(indexname, [{name: 'string'}], {toBuy: 'CInt'}));

server.start();