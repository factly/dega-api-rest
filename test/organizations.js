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

    it('Should get status 422 when no client id', () => {
        return request(mock)
            .get('/api/v1/organizations')
            .expect(422)
    });

    it('Should get status 404 when client id do not match', () => {
        return request(mock)
            .get('/api/v1/organizations')
            .set({ client : 'client'})
            .expect(404)
    });

    it('Should get all organizations', () => {
        return request(mock)
            .get('/api/v1/organizations')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const organizations = JSON.parse(res.text);
                expect(organizations).to.have.property('data');
                const organization = organizations.data;
                // check for fields inside organization document
                expect(organization).to.have.property('id').eq('5d792544bf1bce0001eda477');
                expect(organization).to.have.property('clientId').eq('factly');
                expect(organization).to.have.property('siteTitle').eq('Factly');
                expect(organization).to.have.property('slug').eq('factly');
                expect(organization).to.have.property('name').eq('Factly');
                expect(organization).to.have.property('email').eq('admin@factly.in');
                expect(organization).to.have.property('description').eq('FACTLY is one of the well known Data Journalism/Public Information portals in India. Each news story on FACTLY is backed by factual evidence/data from official sources that is either available in the public domain or that is collated/gathered/collected using tools such as the Right to Information (RTI).')
                expect(organization).to.have.property('createdDate').eq('2019-09-11T16:48:00.000Z');
                expect(organization).to.have.property('lastUpdatedDate').eq('2019-09-26T20:44:36.458Z');
                expect(organization).to.have.property('class').eq('com.factly.dega.domain.Organization');
                //MediaLogo
                expect(organization).to.have.property('mediaLogo');
                const mediaLogo = organization.mediaLogo;
                expect(mediaLogo).to.have.property('sourceURL').eq('https://images.degacms.com/dega-content/factly/2019/9/1569676519335-narendra-modi.png');
            });
    });
});
