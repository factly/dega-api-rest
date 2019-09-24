'use strict';

var app = require('./index');
var http = require('http');
const { createTerminus } = require('@godaddy/terminus');

var server;

/*
 * Create and start HTTP server.
 */
server = http.createServer(app);
function onSignal () {
    console.log('server is starting cleanup');
    // start cleanup of resource, like databases or file descriptors
}
  
async function onHealthCheck () {
    console.log('Health checking');
    // checks if the system is healthy, like the db connection is live
    // resolves, if health, rejects if not
}

createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: { '/healthcheck': onHealthCheck },
    onSignal
});  

var port = process.env.PORT || 8000;
server.listen(port);
server.on('listening', function () {
    console.log('Server listening on http://localhost:'+port);
});
