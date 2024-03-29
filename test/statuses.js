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

    it('Should get status 422 when no client id', () => {
        return request(mock)
            .get('/api/v1/statuses')
            .expect(422)
    });

    it('Should get status 404 when random id is passed as key', () => {
        return request(mock)
            .get('/api/v1/statuses/aaa8f470569ed47e00c7002c')
            .set({ client : 'factly'})
            .expect(404)         
    });

    it('Should get status 404 when random slug is passed as key', () => {
        return request(mock)
            .get('/api/v1/statuses/random')
            .set({ client : 'factly'})
            .expect(404)         
    });

    it('Should get all statuses', () => {
        return request(mock)
            .get('/api/v1/statuses')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const statuses = JSON.parse(res.text);
                expect(statuses).to.have.property('data');
                expect(statuses.data.length).eq(7);
                const status = statuses.data[0];
                // check for fields inside statuses document
                expect(status).to.have.property('id').eq('5c2691852308247c7669a51a');
                expect(status).to.have.property('clientId').eq('factly');
                expect(status).to.have.property('slug').eq('publish');
                expect(status).to.have.property('isDefault').eq(true);
                expect(status).to.have.property('name').eq('Publish');
                expect(status).to.have.property('createdDate').eq('2018-12-28T21:11:33.769Z');
                expect(status).to.have.property('lastUpdatedDate').eq('2018-12-28T21:11:33.769Z');
                
            });
    });

    it('Should get individual status by slug', () => {
        return request(mock)
            .get('/api/v1/statuses/future')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const statuses = JSON.parse(res.text);
                expect(statuses).to.have.property('data');
                const status = statuses.data;
                // check for fields inside statuses document
                expect(status).to.have.property('id').eq('5da58458fa8d86546411ae9e');
                expect(status).to.have.property('clientId').eq('factly');
                expect(status).to.have.property('slug').eq('future');
                expect(status).to.have.property('isDefault').eq(true);
                expect(status).to.have.property('name').eq('Future');
                expect(status).to.have.property('createdDate').eq('2018-12-28T21:11:47.525Z');
                expect(status).to.have.property('lastUpdatedDate').eq('2018-12-28T21:11:47.525Z');
                
            });
    });
    it('Should get individual status by Object Id ', () => {
        return request(mock)
            .get('/api/v1/statuses/5da58458fa8d86546411aea1')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const status = JSON.parse(res.text).data;
                // check for fields inside statuses document
                expect(status).to.have.property('id').eq('5da58458fa8d86546411aea1');
                expect(status).to.have.property('clientId').eq('factly');
                expect(status).to.have.property('slug').eq('trash');
                expect(status).to.have.property('isDefault').eq(true);
                expect(status).to.have.property('name').eq('Trash');
                expect(status).to.have.property('createdDate').eq('2018-12-28T21:12:00.000Z');
                expect(status).to.have.property('lastUpdatedDate').eq('2019-03-13T11:05:29.305Z');
                
            });
    });
});
