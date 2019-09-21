'use strict';

var app = require('./index');
var http = require('http');
var server;

/*
 * Create and start HTTP server.
 */
server = http.createServer(app);
var port = process.env.PORT || 8000;
server.listen(port);
server.on('listening', function () {
    console.log('Server listening on http://localhost:'+port);
});
