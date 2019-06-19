const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/organizations', () => {
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

    it('Should get all organizations', () => {
        return request(mock)
            .get('/api/v1/organizations')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const organizations = JSON.parse(res.text);
                expect(organizations.length).eq(1);
                const organization = organizations[0];
                // check for fields inside orhanization document
                expect(organization).to.have.property('_id').eq('5c1fbe8141e7c425ed54c82b');
                expect(organization).to.have.property('client_id').eq('Factly');
                expect(organization).to.have.property('site_title').eq('Factly');
                expect(organization).to.have.property('slug').eq('factly');
                expect(organization).to.have.property('name').eq('Factly');
                expect(organization).to.have.property('email').eq('hi@factly.in');
                expect(organization).to.have.property('created_date').eq('2018-12-23T16:57:37.464Z');
                expect(organization).to.have.property('last_updated_date').eq('2018-12-23T16:57:37.465Z');
                //degaUser
                expect(organization).to.have.property('degaUsers');
                const degaUsers = organization.degaUsers;
                expect(degaUsers.length).eq(0);
                //degaUser-degaUserDefault
                expect(organization).to.have.property('degaUserDefault');
                const degaUserDefault = organization.degaUserDefault;
                expect(degaUserDefault.length).eq(0);
                //degaUser-degaUserCurrent
                expect(organization).to.have.property('degaUserCurrent');
                const degaUserCurrent = organization.degaUserCurrent;
                expect(degaUserCurrent.length).eq(0);
            });
    });
});
