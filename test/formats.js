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

    it('Should get status 422 when no client id', () => {
        return request(mock)
            .get('/api/v1/formats')
            .expect(422)
    });

    it('Should get status 404 when random id is passed as key' , () => {
        return request(mock)
            .get('/api/v1/formats/aaa8f470569ed47e00c7002c')
            .set({ client : 'factly'})
            .expect(404)         
    });

    it('Should get status 404 when random slug is passed as key', () => {
        return request(mock)
            .get('/api/v1/formats/random')
            .set({ client : 'factly'})
            .expect(404)         
    });

    it('Should get all formats', () => {
        return request(mock)
            .get('/api/v1/formats')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const formats = JSON.parse(res.text);
                expect(formats).to.have.property('data');
                expect(formats.data.length).eq(4);
                const format = formats.data[0];
                // check for fields inside formats document
                expect(format).to.have.property('id').eq('5ce249139753e795dc53c363');
                expect(format).to.have.property('isDefault').eq(true);
                expect(format).to.have.property('clientId').eq('factly');
                expect(format).to.have.property('slug').eq('audio');
                expect(format).to.have.property('name').eq('Audio');
                expect(format).to.have.property('createdDate').eq('2018-12-31T19:40:02.385Z');
                expect(format).to.have.property('lastUpdatedDate').eq('2018-12-31T19:40:02.385Z');
                expect(format).to.have.property('class').eq('com.factly.dega.domain.Format');
            });
    });

    it('Should get individual format by slug', () => {
        return request(mock)
            .get('/api/v1/formats/chat')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const formats = JSON.parse(res.text);
                expect(formats).to.have.property('data');
                const format = formats.data;
                // check for fields inside formats document
                expect(format).to.have.property('id').eq('5d79106de5c62900019d7851');
                expect(format).to.have.property('isDefault').eq(true);
                expect(format).to.have.property('clientId').eq('factly');
                expect(format).to.have.property('slug').eq('chat');
                expect(format).to.have.property('name').eq('Chat');
                expect(format).to.have.property('createdDate').eq('2018-12-31T19:40:35.077Z');
                expect(format).to.have.property('lastUpdatedDate').eq('2018-12-31T19:40:35.077Z');
                expect(format).to.have.property('class').eq('com.factly.dega.domain.Format');
            });
    });

    it('Should get individual format by id', () => {
        return request(mock)
            .get('/api/v1/formats/5c2a71152308247c7669a60f')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const format = JSON.parse(res.text).data;
                // check for fields inside formats document
                expect(format).to.have.property('id').eq('5c2a71152308247c7669a60f');
                expect(format).to.have.property('isDefault').eq(true);
                expect(format).to.have.property('clientId').eq('factly');
                expect(format).to.have.property('slug').eq('status');
                expect(format).to.have.property('name').eq('Status');
                expect(format).to.have.property('createdDate').eq('2018-12-31T19:40:47.419Z');
                expect(format).to.have.property('lastUpdatedDate').eq('2018-12-31T19:40:47.419Z');
                expect(format).to.have.property('class').eq('com.factly.dega.domain.Format');
            });
    }); 

    it('Should get format by query param slug', () => {
        return request(mock)
            .get('/api/v1/formats?slug=video')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const formats = JSON.parse(res.text);
                expect(formats).to.have.property('data');
                expect(formats.data.length).eq(1);
                const format = formats.data[0];
                // check for fields inside formats document
                expect(format).to.have.property('name').eq('Video');
            });
    });
});

