/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';
const confit = require('confit');
const logger = require('logger').createLogger();
const db = require('../lib/database');

var kraken = require('kraken-js'),
    express = require('express'),
    path = require('path'),
    request = require('supertest');


describe('posts', function () {

    var app, mock;


    beforeEach(function (done) {
        app = express();
        app.on('start', done);
        app.use(kraken({
            basedir: path.resolve(__dirname, '..')
        }));

        mock = app.listen(1337);

    });


    afterEach(function (done) {
        mock.close(done);
    });


    it('should have model name "posts"', function (done) {
        request(mock)
            .get('/api/v1/posts')
            .expect(200)
            .expect('Content-Type', /html/)

            .expect(/"name": "posts"/)

            /* eslint-disable no-unused-vars */
            .end(function (err, res) {
                done(err);
            });
    });

    it('check for db connection', (done) => {
        confit(path.join(__dirname, 'config')).create((confitErr, config2) => {
            const dbConfig = config2.get('databaseConfig');

            /* eslint-disable no-unused-vars */
            db.config(dbConfig, logger).then((result) => {
                db.serverStatus()
                    .then((status) => {
                        if (status.ok) {
                            logger.info('Database is running fine');
                        } else {
                            logger.info('Database is reporting issues');
                        }
                    });
            });
        });
        done();
    });

});
