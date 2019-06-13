const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/formats', () => {
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

    it('Should get all formats', () => {
        return request(mock)
            .get('/api/v1/formats')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const formats = JSON.parse(res.text);
                expect(formats.length).eq(4);
                const format = formats[0];
                // check for fields inside formats document
                //expect(format).to.have.property('_id').eq('ObjectId("5ce249139753e795dc53c363")');
                //expect(format).to.have.property('is_default').eq('true');
                expect(format).to.have.property('client_id').eq('Factly');
                expect(format).to.have.property('slug').eq('audio');
                expect(format).to.have.property('name').eq('Audio');
                expect(format).to.have.property('created_date').eq('2018-12-31T19:40:02.385Z');
                expect(format).to.have.property('last_updated_date').eq('2018-12-31T19:40:02.385Z');
                //post
                expect(format).to.have.property('post');
                const post = format.post;
                expect(post.length).eq(0);
            });
    });
});
