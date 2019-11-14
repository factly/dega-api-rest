const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/claimants', () => {
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
            .get('/api/v1/claimants')
            .expect(422)
    });

    it('Should get all claimants', () => {
        return request(mock)
            .get('/api/v1/claimants')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const claimants = JSON.parse(res.text);
                expect(claimants).to.have.property('data');
                expect(claimants.data.length).eq(3);
                const claimant = claimants.data[1];
                // check for fields inside claimants document
                expect(claimant).to.have.property('id').eq('5c3e3517569ed47d9451940f');
                expect(claimant).to.have.property('clientId').eq('factly');
                expect(claimant).to.have.property('description').eq('This is the description for Govt of India');
                expect(claimant).to.have.property('slug').eq('government-of-india');
                expect(claimant).to.have.property('name').eq('Government of India');
                expect(claimant).to.have.property('createdDate').eq('2019-01-15T19:31:35.627Z');
                expect(claimant).to.have.property('lastUpdatedDate').eq('2019-01-15T19:31:35.627Z');
                //media
                expect(claimant).to.have.property('media');
                const media = claimant.media;
                expect(media).to.have.property('sourceURL').eq('https://images.degacms.com/dega-content/factly/2019/9/1569676519335-government-of-india.png');              
            });
    });

    it('Should get individual claimant by Object Id', () => {
        return request(mock)
            .get('/api/v1/claimants/4d3e3517545ed47d9451944f')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const claimant = JSON.parse(res.text).data;
                // check for fields inside claimants document
                expect(claimant).to.have.property('id').eq('4d3e3517545ed47d9451944f');
                expect(claimant).to.have.property('clientId').eq('factly');
                expect(claimant).to.have.property('description').eq('Narendra Modi is the Prime Minister of India');
                expect(claimant).to.have.property('slug').eq('narendra-modi');
                expect(claimant).to.have.property('name').eq('Narendra Modi');
                expect(claimant).to.have.property('createdDate').eq('2019-01-15T19:32:05.664Z');
                expect(claimant).to.have.property('lastUpdatedDate').eq('2019-01-15T19:32:05.664Z');
                //media
                expect(claimant).to.have.property('media');
                const media = claimant.media;
                expect(media).to.have.property('sourceURL').eq('https://images.degacms.com/dega-content/factly/2019/9/1569676519335-narendra-modi.png');              
            });
    });

    it('Should get individual claimant by Slug', () => {
        return request(mock)
            .get('/api/v1/claimants/rahul-gandhi-12345')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const claimants = JSON.parse(res.text);
                expect(claimants).to.have.property('data');
                const claimant = claimants.data;
                // check for fields inside claimants document
                expect(claimant).to.have.property('id').eq('5d8f5c68f4f39f0001e419e9');
                expect(claimant).to.have.property('clientId').eq('factly');
                expect(claimant).to.have.property('description').eq('Rahul Gandhi is the President of Indian National Congress');
                expect(claimant).to.have.property('slug').eq('rahul-gandhi-12345');
                expect(claimant).to.have.property('name').eq('Rahul Gandhi');
                expect(claimant).to.have.property('createdDate').eq('2019-01-15T19:34:52.423Z');
                expect(claimant).to.have.property('lastUpdatedDate').eq('2019-01-15T19:34:52.423Z');
                //media
                expect(claimant).to.have.property('media');
                const media = claimant.media;
                expect(media).to.have.property('sourceURL').eq('https://images.degacms.com/dega-content/factly/2019/9/1569676519335-rahul-gandhi.png');              
            });
    });

    it('Should get status 404 when random id is passed as key', () => {
        return request(mock)
            .get('/api/v1/claimants/aaa8f470569ed47e00c7002c')
            .set({ client : 'factly'})
            .expect(404)         
    });

    it('Should get status 404 when random slug is passed as key', () => {
        return request(mock)
            .get('/api/v1/claimants/random')
            .set({ client : 'factly'})
            .expect(404)         
    });
});
