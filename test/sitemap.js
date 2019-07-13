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

    it('Should get all URLs', () => {
        return request(mock)
            .get('/api/v1/sitemap')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const sitemaps = JSON.parse(res.text);
                expect(sitemaps.length).eq(17);
                const site_address = sitemaps[0];
                expect(site_address).eq('https://factly.in');
                sitemaps.shift();
                for(const url in sitemaps){
                    // check if the url is set right with the domain name of the client organisation
                    expect(url.startsWith(site_address)).eq('https://factly.in');
                }
            });
    });
});
