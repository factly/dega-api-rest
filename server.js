const app = require('./index');
const http = require('http');
const { MongoClient } = require('mongodb')
const { createTerminus } = require('@godaddy/terminus');

let client
let db

function onHealthCheck () {
    return db.command({ ping: 1 })
}

function onSignal () {
    console.log('server is starting cleanup')
    return client.close().then(() => console.log('client has disconnected'))
      .catch(err => console.error('error during disconnection', err.stack))
}
  
async function startServer () {
    client = await MongoClient.connect(process.env.MONGODB_URI)
    db = client.db('terminus')
  
    console.log('db connected')
  
    let port = process.env.PORT || 8000;

    createTerminus(http.createServer(app), {
        signal: 'SIGINT',
        healthChecks: {
            '/healthcheck': onHealthCheck
        },
    
        onSignal
    }).listen(port)
}
  
startServer()
    .catch(err => console.error('connection error', err.stack))
