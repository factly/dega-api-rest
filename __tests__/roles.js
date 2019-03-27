const kraken = require('kraken-js');
const request = require('supertest');
const express = require('express');

const db = require('../lib/database');
const DegaLogger = require('../lib/logger');
// const app = express();
var app = require('../index');
const server = require('http').createServer(app);
let mock;
let logger;

describe('/api/v1/roles', () => {
    beforeAll((done) => {
        app.on('start', done);
        app.use(kraken({
            basedir: process.cwd(),
            onconfig: (config, next) => {
                logger = new DegaLogger(config.get('middleware').logger.module.arguments[0]);
                return db.config(config.get('databaseConfig'), logger)
                    .then(() => {
                        // any config setup/overrides here
                        next(null, config);
                    })
                    .catch(next);
            },
        }));

        console.log('Listening on port 1200');
        mock = server.listen(1200);
    });

    afterAll((done) => {
        process.removeAllListeners('uncaughtException');
        process.removeAllListeners('SIGINT');
        process.removeAllListeners('SIGTERM');
        db.closeConnection();
        console.log('Cleaning up');
        app.removeListener('start', done);
        mock.close(done);
    });

    test('It adds two numbers', () => {
        expect(1 + 1).toBe(2);
    });

    test('It should return list of roles', async () => {
        const response = await request(mock).get('/api/v1/roles');
        // expect(response.body).toEqual(['Elie', 'Matt', 'Joel', 'Michael']);
        expect(response.statusCode).toBe(200);
    });
});
