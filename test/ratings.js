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

    it('Should get status 422 when no client id', () => {
        return request(mock)
            .get('/api/v1/ratings')
            .expect(422)
    });

    it('Should get all ratings', () => {
        return request(mock)
            .get('/api/v1/ratings')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const ratings = JSON.parse(res.text);
                expect(ratings.data.length).eq(5);
                const rating = ratings.data[0];
                expect(rating).to.have.property('id').eq('5d791140e10bf00001fad893');
                expect(rating).to.have.property('numericValue').eq(5);
                expect(rating).to.have.property('isDefault').eq(true);
                expect(rating).to.have.property('clientId').eq('default');
                expect(rating).to.have.property('slug').eq('true');
                expect(rating).to.have.property('name').eq('True');
                expect(rating).to.have.property('createdDate').eq('2019-09-11T15:22:00.000Z');
                expect(rating).to.have.property('lastUpdatedDate').eq('2019-09-12T04:38:43.403Z');
                expect(rating).to.have.property('class').eq('com.factly.dega.domain.Rating')
                //media
                expect(rating).to.have.property('media');
                const media = rating.media;
                expect(media).to.have.property('sourceURL').eq('https://images.degacms.com/dega-content/factly/2019/9/1568222996045-true.png');
            });
    });

    /*it('Should get ratings by Object Id', () => {
        return request(mock)
            .get('/api/v1/ratings/5d7911a8e10bf00001fad8a0')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const ratings = JSON.parse(res.text);
                const rating = ratings.data;
                expect(rating).to.have.property('id').eq('5d7911a8e10bf00001fad8a0');
                expect(rating).to.have.property('numericValue').eq(1);
                expect(rating).to.have.property('isDefault').eq(true);
                expect(rating).to.have.property('clientId').eq('default');
                expect(rating).to.have.property('slug').eq('false');
                expect(rating).to.have.property('name').eq('False');
                expect(rating).to.have.property('createdDate').eq('2019-09-11T15:24:00.000Z');
                expect(rating).to.have.property('lastUpdatedDate').eq('2019-09-12T04:39:35.362Z');
                expect(rating).to.have.property('class').eq('com.factly.dega.domain.Rating')
                //media
                expect(rating).to.have.property('media');
                const media = rating.media;
                expect(media).to.have.property('sourceURL').eq('https://images.degacms.com/dega-content/factly/2019/9/1568231061576-false.png');
            });
    });
    */

    it('Should get ratings by slug', () => {
        return request(mock)
            .get('/api/v1/ratings/misleading')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const ratings = JSON.parse(res.text);
                const rating = ratings.data;
                expect(rating).to.have.property('numericValue').eq(2);
                expect(rating).to.have.property('isDefault').eq(true);
                expect(rating).to.have.property('clientId').eq('default');
                expect(rating).to.have.property('slug').eq('misleading');
                expect(rating).to.have.property('name').eq('Misleading');
                expect(rating).to.have.property('createdDate').eq('2019-09-11T15:23:00.000Z');
                expect(rating).to.have.property('lastUpdatedDate').eq('2019-09-12T04:39:26.538Z');
                expect(rating).to.have.property('class').eq('com.factly.dega.domain.Rating')
                //media
                expect(rating).to.have.property('media');
                const media = rating.media;
                expect(media).to.have.property('sourceURL').eq('https://images.degacms.com/dega-content/factly/2019/9/1568230991737-misleading.png');
            });
    });

    /*it('Should get all ratings by client id', () => {
        return request(mock)
            .get('/api/v1/ratings?client=default')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const ratings = JSON.parse(res.text);
                expect(ratings.data.length).eq(5);
            });
    });
    */
});
