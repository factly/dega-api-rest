const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/factchecks', () => {
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

    it('Should get all factchecks', () => {
        return request(mock)
            .get('/api/v1/factchecks')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const factchecks = JSON.parse(res.text);
                console.log(factchecks);
                expect(factchecks.data.length).eq(2);
                const factcheck = factchecks.data[0];

                // check for fields inside factcheck document
                expect(factcheck).to.have.property('id').eq('5c71d32bfd3c00900fae209c');
                expect(factcheck).to.have.property('clientId').eq('factly');
                expect(factcheck).to.have.property('featuredMedia').eq('http://localhost:8080/core/dega-content/Factly/2019/2/screen-shot-2019-02-13-at-9.45.40-am.png');
                expect(factcheck).to.have.property('slug').eq('test-02232019');
                expect(factcheck).to.have.property('title').eq('test 02232019');
                expect(factcheck).to.have.property('summary').eq('test summary');

                // check for expanded sub documents
                // authors
                expect(factcheck).to.have.property('authors');
                const authors = factcheck.authors;
                expect(authors.length).eq(1);
                const author = authors[0];
                expect(author).to.have.property('slug').eq('shashi-deshetti');

                // categories
                expect(factcheck).to.have.property('categories');
                const categories = factcheck.categories;
                expect(categories.length).eq(1);
                const category = categories[0];
                expect(category).to.have.property('slug').eq('politics');

                // claims
                expect(factcheck).to.have.property('claims');
                const claims = factcheck.claims;
                expect(claims.length).eq(2);
                const claim = claims[0];
                expect(claim).to.have.property('slug').eq('the-number-of-consequential-train-accidents-reduced-to-62-in-201718-compared-to-201314-the-claim-also-states-that-118-accidents-were-recorded-in-201314-whereas-only-72-accidents-were-recorded-in-201718');

                // schemas
                expect(factcheck).to.have.property('schemas');
                const schemas = factcheck.schemas;
                expect(schemas.length).eq(2);
                const schema = schemas[0];
                expect(schema).to.have.property('@type').eq('ClaimReview');
                expect(schema).to.have.property('url').eq('http://www.politifact.com/texas/statements/2014/jul/23/rick-perry/rick-perry-claim-about-3000-homicides-illegal-immi/');
                expect(schema).to.have.property('claimReviewed').eq('Broad Gauge line commissioned between the years 2009 and 2014 is 7,600 kms where as it is 9,528 kms between 2014 and 2018.');
                expect(schema).to.have.property('reviewRating');
                expect(schema.reviewRating).to.have.property('bestRating').eq(5);
                expect(schema.reviewRating).to.have.property('worstRating').eq(1);

                // status
                expect(factcheck).to.have.property('status');
                expect(factcheck.status).to.have.property('slug').eq('Publish');

                // tags
                expect(factcheck).to.have.property('tags');
                const tags = factcheck.tags;
                expect(tags.length).eq(1);
                const tag = tags[0];
                expect(tag).to.have.property('slug').eq('Crude-Oil');
            });
    });


    it('Should get factchecks with only mandatory sub docs', () => {
        return request(mock)
            .get('/api/v1/factchecks')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const factchecks = JSON.parse(res.text);
                expect(factchecks.data.length).eq(2);
            });
    });

    it('Should skip factcheck on missing status sub doc', () => {
        return request(mock)
            .get('/api/v1/factchecks')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const factchecks = JSON.parse(res.text);
                expect(factchecks.data.length).eq(2);
            });
    });

    it('Should skip factcheck on missing claims sub docs', () => {
        return request(mock)
            .get('/api/v1/factchecks')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const factchecks = JSON.parse(res.text);
                expect(factchecks.data.length).eq(2);
            });
    });

    it('Should skip factcheck on missing users sub docs', () => {
        return request(mock)
            .get('/api/v1/factchecks')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const factchecks = JSON.parse(res.text);
                expect(factchecks.data.length).eq(2);
            });
    });
});
