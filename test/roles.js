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
                const result = JSON.parse(res.text);
                expect(result.length).eq(6);

            });
    });

    it('Should list all roles by client', () => {
        return request(mock)
            .get('/api/v1/roles?client=default')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const result = JSON.parse(res.text);
                expect(result.length).eq(6);

            });
    });

    it('Should get role by slug', () => {
        return request(mock)
            .get('/api/v1/roles?slug=super-admin')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const roles = JSON.parse(res.text);
                expect(roles.length).eq(1);
                const superAdminRole = roles[0];
                expect(superAdminRole).to.have.property('name');
                expect(superAdminRole).to.have.property('name').eq('Super Admin');
                const role = roles[0];
                // check for fields inside roles document
                //expect(role).to.have.property('_id').eq('ObjectId("5ce2626339954523f9e638a9")');
                //expect(role).to.have.property('is_default').eq('true');
                expect(role).to.have.property('client_id').eq('default');
                expect(role).to.have.property('slug').eq('super-admin');
                expect(role).to.have.property('name').eq('Super Admin');
                expect(role).to.have.property('created_date').eq('2018-12-10T07:00:00.000Z');
                expect(role).to.have.property('last_updated_date').eq('2018-12-10T07:00:00.000Z');
                //degaUser
                expect(role).to.have.property('degaUser');
                const dega = role.degaUser;
                expect(dega.length).eq(0);
            });
    });
    it('Should get role by slug', () => {
        return request(mock)
            .get('/api/v1/roles?slug=false')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const roles = JSON.parse(res.text);
                expect(roles.length).eq(0);
            });
        });
     it('Should get role by slug', () => {
        return request(mock)
            .get('/api/v1/roles?client_id=default')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const roles = JSON.parse(res.text).data;
                expect(roles.length).eq(6);
             });
        });
});

