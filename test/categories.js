const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/categories', () => {
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

    it('Should get all categories', () => {
        return request(mock)
            .get('/api/v1/categories')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const categories = JSON.parse(res.text);
                expect(categories).to.have.property('data');
                expect(categories.data.length).eq(6);
                const category = categories.data[5];
                // check for fields inside categories document
                expect(category).to.have.property('id').eq('5c38f470569ed47e00c7002b');
                expect(category).to.have.property('clientId').eq('factly');
                expect(category).to.have.property('slug').eq('politics');
                expect(category).to.have.property('name').eq('Politics');
                expect(category).to.have.property('description').eq('Category Politics');
                expect(category).to.have.property('createdDate').eq('2019-01-11T19:54:17.694Z');
                expect(category).to.have.property('lastUpdatedDate').eq('2019-01-11T19:54:17.694Z');
                expect(category).to.have.property('class').eq('com.factly.dega.domain.Category');
               
            });
            
    });
    
    it('Should get individual category by slug', () => {
        return request(mock)
            .get('/api/v1/categories/sports')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const categories= JSON.parse(res.text);
                expect(categories).to.have.property('data');
                const category = categories.data;
                // check for fields inside individual category document
                expect(category).to.have.property('clientId').eq('factly');
                expect(category).to.have.property('slug').eq('sports');
                expect(category).to.have.property('name').eq('Sports');
                expect(category).to.have.property('description').eq('Category sports');
                expect(category).to.have.property('createdDate').eq('2019-01-11T19:55:00.426Z');
                expect(category).to.have.property('lastUpdatedDate').eq('2019-01-11T19:55:00.426Z');
                expect(category).to.have.property('class').eq('com.factly.dega.domain.Category');
                expect(category).to.have.property('class').eq('com.factly.dega.domain.Category');
            });
            
    });
    
    /*it('Should get individual category by id', () => {
        return request(mock)
            .get('/api/v1/categories/5c38f470569ed47e00c7002c')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const category = JSON.parse(res.text);
                // check for fields inside individual category document
                expect(category.data).to.have.property('id').eq('5c38f470569ed47e00c7002c')
                expect(category.data).to.have.property('clientId').eq('factly');
                expect(category.data).to.have.property('slug').eq('bussiness');
                expect(category.data).to.have.property('name').eq('Bussiness');
                expect(category).to.have.property('description').eq('Category bussiness');
                expect(category.data).to.have.property('createdDate').eq('2019-01-11T19:54:24.264Z');
                expect(category.data).to.have.property('lastUpdatedDate').eq('2019-01-11T19:54:24.264Z');
                expect(category.data).to.have.property('class').eq('com.factly.dega.domain.Category');
               
            });            
    });
    */
});
    

