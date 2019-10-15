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

    it('Should get all roles', () => {
        return request(mock)
            .get('/api/v1/roles')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const roles = JSON.parse(res.text);
                expect(roles.data.length).eq(6);
                const role = roles.data[0];
                // check for fields inside roles document
                expect(role).to.have.property('name').eq('Subscriber');
                expect(role).to.have.property('id').eq('5d791792bf1bce0001eda469');
                expect(role).to.have.property('isDefault').eq(true);
                expect(role).to.have.property('clientId').eq('default');
                expect(role).to.have.property('slug').eq('subscriber');
                expect(role).to.have.property('createdDate').eq('2019-09-11T15:49:38.555Z');
                expect(role).to.have.property('lastUpdatedDate').eq('2019-09-11T15:49:38.555Z');

            });
    });

    it('Should list all roles by client', () => {
        return request(mock)
            .get('/api/v1/roles?client=default')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const result = JSON.parse(res.text);
                expect(result.data.length).eq(6);

            });
    });

    it('Should get role by slug', () => {
        return request(mock)
            .get('/api/v1/roles/super-admin')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const result = JSON.parse(res.text);
                const role = result.data;
                // check for fields inside roles document
                expect(role).to.have.property('name');
                expect(role).to.have.property('name').eq('Super Admin');
                expect(role).to.have.property('id').eq('5d791760bf1bce0001eda455');
                expect(role).to.have.property('isDefault').eq(true);
                expect(role).to.have.property('clientId').eq('default');
                expect(role).to.have.property('slug').eq('super-admin');
                expect(role).to.have.property('createdDate').eq('2019-09-11T15:48:48.242Z');
                expect(role).to.have.property('lastUpdatedDate').eq('2019-09-11T15:48:48.242Z');
            });
    });
});
