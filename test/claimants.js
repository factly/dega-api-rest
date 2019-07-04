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

    it('Should get all claimants', () => {
        return request(mock)
            .get('/api/v1/claimants')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const claimants = JSON.parse(res.text);
                expect(claimants.length).eq(3);
                const claimant = claimants[0];
                // check for fields inside claimants document
                //expect(claimant).to.have.property('_id').eq('ObjectId("5cdfb2f398ceedf8f2053080")');
                expect(claimant).to.have.property('client_id').eq('Factly');
                expect(claimant).to.have.property('description').eq('This is the description for Govt of India');
                expect(claimant).to.have.property('slug').eq('government-of-india');
                expect(claimant).to.have.property('name').eq('Government of India');
                expect(claimant).to.have.property('created_date').eq('2019-01-15T19:31:35.627Z');
                expect(claimant).to.have.property('last_updated_date').eq('2019-01-15T19:31:35.627Z');
                //claim
                expect(claimant).to.have.property('claim');
                const claim = claimant.claim;
                expect(claim.length).eq(0);
               
            });
    });
    it('Should get all claimants', () => {
        return request(mock)
            .get('/api/v1/claimants?client_id=Factly')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const claimants = JSON.parse(res.text).data;
                expect(claimants.length).eq(3);
            });
        });
});
