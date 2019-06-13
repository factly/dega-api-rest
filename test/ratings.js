const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/ratings', () => {
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

    it('Should get all ratings', () => {
        return request(mock)
            .get('/api/v1/ratings')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const ratings = JSON.parse(res.text);
                expect(ratings.length).eq(5);
                const rating = ratings[0];
                
                //expect(rating).to.have.property('_id').eq('ObjectId("5ce24d82cc90bda1f1e2716b")');
                //expect(rating).to.have.property('numeric_value').eq('1.0');
                //expect(rating).to.have.property('is_default').eq('true');
                expect(rating).to.have.property('client_id').eq('default');
                expect(rating).to.have.property('slug').eq('false');
                expect(rating).to.have.property('name').eq('False');
                expect(rating).to.have.property('created_date').eq('2018-12-12T07:00:00.000Z');
                expect(rating).to.have.property('last_updated_date').eq('2018-12-12T07:00:00.000Z');
                //claim
                expect(rating).to.have.property('claim');
                const Rating = rating.claim;
                expect(Rating.length).eq(0);
            });
    });
});
