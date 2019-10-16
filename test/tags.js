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
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const tags = JSON.parse(res.text);
                expect(tags.data.length).eq(4);
                const tag = tags.data[3];
                // check for fields inside tags document
                expect(tag).to.have.property('id').eq('5c38f4f5569ed47e00c70045');
                expect(tag).to.have.property('clientId').eq('factly');
                expect(tag).to.have.property('slug').eq('Crude-Oil');
                expect(tag).to.have.property('name').eq('Crude Oil');
                expect(tag).to.have.property('createdDate').eq('2019-01-11T19:56:37.736Z');
                expect(tag).to.have.property('lastUpdatedDate').eq('2019-01-11T19:56:37.736Z');
                expect(tag).to.have.property('class').eq('com.factly.dega.domain.Tag');

            });
    });

    /*it('Should get tag by object id', () => {
        return request(mock)
            .get('/api/v1/tags/5c38f513569ed47e00c7004f')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const tags = JSON.parse(res.text);
                expect(tags.data.length).eq(4);
                const tag = tags.data[0];
                // check for fields inside tags document
                expect(tag).to.have.property('id').eq('5c38f513569ed47e00c7004f');
                expect(tag).to.have.property('clientId').eq('factly');
                expect(tag).to.have.property('slug').eq('Bad-Loans');
                expect(tag).to.have.property('name').eq('Bad Loans');
                expect(tag).to.have.property('createdDate').eq('2019-01-11T19:57:00.000Z');
                expect(tag).to.have.property('lastUpdatedDate').eq('2019-01-11T19:58:05.665Z');
                expect(tag).to.have.property('class').eq('com.factly.dega.domain.Tag');

            });
    });
    */

    it('Should get tag by slug', () => {
        return request(mock)
            .get('/api/v1/tags/Child-Sex-Ratio')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const tags = JSON.parse(res.text);
                const tag = tags.data;
                // check for fields inside tags document
                expect(tag).to.have.property('id').eq('5c38f554569ed47e00c70059');
                expect(tag).to.have.property('clientId').eq('factly');
                expect(tag).to.have.property('slug').eq('Child-Sex-Ratio');
                expect(tag).to.have.property('name').eq('Child Sex Ratio');
                expect(tag).to.have.property('createdDate').eq('2019-01-11T19:58:12.712Z');
                expect(tag).to.have.property('lastUpdatedDate').eq('2019-01-11T19:58:12.712Z');
                expect(tag).to.have.property('class').eq('com.factly.dega.domain.Tag');

            });
    });
});
