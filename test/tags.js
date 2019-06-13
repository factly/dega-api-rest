const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/tags', () => {
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

    it('Should get all tags', () => {
        return request(mock)
            .get('/api/v1/tags')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const tags = JSON.parse(res.text);
                expect(tags.length).eq(4);
                const tag = tags[0];
                // check for fields inside tags document
                expect(tag).to.have.property('_id').eq('5c38f4f5569ed47e00c70045');
                expect(tag).to.have.property('client_id').eq('Factly');
                expect(tag).to.have.property('slug').eq('Crude-Oil');
                expect(tag).to.have.property('name').eq('Crude Oil');
                expect(tag).to.have.property('created_date').eq('2019-01-11T19:56:37.736Z');
                expect(tag).to.have.property('last_updated_date').eq('2019-01-11T19:56:37.736Z');
                //post
                expect(tag).to.have.property('posts');
                const posts = tag.posts;
                expect(posts.length).eq(0);

            });
    });
});
