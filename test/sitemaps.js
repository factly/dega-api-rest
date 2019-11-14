const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/sitemap', () => {
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

    it('Should get sitemap', () => {
        return request(mock)
            .get('/api/v1/sitemap')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const sitemap = JSON.parse(res.text).data;
                // check for fields inside sitemap document
                expect(sitemap.categories.length).eq(8);
                expect(sitemap.users.length).eq(4);
                expect(sitemap.formats.length).eq(4);
                expect(sitemap.posts.length).eq(8);
                expect(sitemap.statuses.length).eq(7);
                expect(sitemap.tags.length).eq(4);
                expect(sitemap.claims.length).eq(4);
                expect(sitemap.claimants.length).eq(3);
                expect(sitemap.ratings.length).eq(5);
                expect(sitemap.factchecks.length).eq(6);
               });
    });
});
