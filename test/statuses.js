const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/statuses', () => {
    before((done) => {
        app.on('start', done);
        app.use(kraken({
            basedir: process.cwd(),
            onconfig: (config, next) => {
                const logger = new DegaLogger(config.get('middleware').logger.module.arguments[0]);
                db.config(config.get('databaseConfig'), logger)
                    .then(() => {
                        // any config setup/overrides here
                        next(null, config);
                    })
                    .catch(next);
            }
        }));

        mock = server.listen(1200);
    });

    after((done) => {
        process.removeAllListeners('uncaughtException');
        process.removeAllListeners('SIGINT');
        process.removeAllListeners('SIGTERM');
        db.closeConnection();
        app.removeListener('start', done);
        mock.close(done);
    });

    it('Should get all statuses', () => {
        return request(mock)
            .get('/api/v1/statuses')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const statuses = JSON.parse(res.text);
                expect(statuses.data.length).eq(7);
                const status = statuses.data[0];
                // check for fields inside statuses document
                expect(status).to.have.property('_id').eq('5c2691852308247c7669a51a');
                expect(status).to.have.property('client_id').eq('Factly');
                expect(status).to.have.property('slug').eq('Publish');
                //expect(status).to.have.property('is_default').eq('true');
                expect(status).to.have.property('name').eq('Publish');
                expect(status).to.have.property('created_date').eq('2018-12-28T21:11:33.769Z');
                expect(status).to.have.property('last_updated_date').eq('2018-12-28T21:11:33.769Z');
                //post
                expect(status).to.have.property('post');
                const post = status.post;
                expect(post.length).eq(0);
               
            });
    });
});
