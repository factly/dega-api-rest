const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/roles', () => {
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

    it('Should get status 404 when random id is passed as key', () => {
        return request(mock)
            .get('/api/v1/roles/aaa8f470569ed47e00c7002c')
            .set({ client : 'factly'})
            .expect(404)         
    });

    it('Should get status 404 when random slug is passed as key', () => {
        return request(mock)
            .get('/api/v1/roles/random')
            .set({ client : 'factly'})
            .expect(404)         
    });

    it('Should get all roles', () => {
        return request(mock)
            .get('/api/v1/roles')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const roles = JSON.parse(res.text);
                expect(roles.data.length).eq(6);
                const role = roles.data[0];
                // check for fields inside roles document
                expect(role).to.have.property('name').eq('Subscriber');
                expect(role).to.have.property('id').eq('5d791792bf1bce0001eda469');
                expect(role).to.have.property('keyclockId').eq('a2fc805b-ef02-41c5-a45a-c9e9081857d4');
                expect(role).to.have.property('keyclockName').eq('ROLE_SUBSCRIBER');
                expect(role).to.have.property('isDefault').eq(true);
                expect(role).to.have.property('clientId').eq('default');
                expect(role).to.have.property('slug').eq('subscriber');
                expect(role).to.have.property('createdDate').eq('2019-09-11T15:49:38.555Z');
                expect(role).to.have.property('lastUpdatedDate').eq('2019-09-11T15:49:38.555Z');

            });
    });

    it('Should list all roles by clientId', () => {
        return request(mock)
            .get('/api/v1/roles?client=default')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const result = JSON.parse(res.text);
                expect(result.data.length).eq(6);

            });
    });

    it('Should list all roles by query param slug', () => {
        return request(mock)
            .get('/api/v1/roles?slug=editor')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const result = JSON.parse(res.text);
                expect(result.data.length).eq(1);
            });
    });

    it('Should get individual role by slug', () => {
        return request(mock)
            .get('/api/v1/roles/super-admin')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const role = JSON.parse(res.text).data;
                // check for fields inside roles document
                expect(role).to.have.property('name').eq('Super Admin');
                expect(role).to.have.property('id').eq('5d791760bf1bce0001eda455');
                expect(role).to.have.property('keyclockId').eq('f5563992-526b-4acf-840a-10dedc1936f3');
                expect(role).to.have.property('keyclockName').eq('ROLE_SUPER_ADMIN');
                expect(role).to.have.property('isDefault').eq(true);
                expect(role).to.have.property('clientId').eq('default');
                expect(role).to.have.property('slug').eq('super-admin');
                expect(role).to.have.property('createdDate').eq('2019-09-11T15:48:48.242Z');
                expect(role).to.have.property('lastUpdatedDate').eq('2019-09-11T15:48:48.242Z');
            });
    });

    it('Should get individual role by Object Id', () => {
        return request(mock)
            .get('/api/v1/roles/5d791774bf1bce0001eda45d')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const role = JSON.parse(res.text).data;
                // check for fields inside roles document
                expect(role).to.have.property('name').eq('Editor');
                expect(role).to.have.property('id').eq('5d791774bf1bce0001eda45d');
                expect(role).to.have.property('keyclockId').eq('0cc318fb-d290-4438-a240-3dba1757c914');
                expect(role).to.have.property('keyclockName').eq('ROLE_EDITOR');
                expect(role).to.have.property('isDefault').eq(true);
                expect(role).to.have.property('clientId').eq('default');
                expect(role).to.have.property('slug').eq('editor');
                expect(role).to.have.property('createdDate').eq('2019-09-11T15:49:08.547Z');
                expect(role).to.have.property('lastUpdatedDate').eq('2019-09-11T15:49:08.547Z');
            });
    });


});
