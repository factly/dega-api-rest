'use strict';

var logger = require('logger').createLogger();
var app = require('./index');
var http = require('http');


var server;

/*
 * Create and start HTTP server.
 */

server = http.createServer(app);
server.listen(process.env.PORT || 8000);
server.on('listening', function () {
    logger.debug('Server listening on http://localhost:%d', this.address().port);
});
