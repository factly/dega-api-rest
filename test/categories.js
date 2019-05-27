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
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const categories = JSON.parse(res.text);
                expect(categories.length).eq(6);
                const category = categories[0];
                 // check for fields inside categories document
                 expect(category).to.have.property('_id').eq('5c38f470569ed47e00c7002b');
                 expect(category).to.have.property('client_id').eq('Factly');
                 expect(category).to.have.property('slug').eq('politics');
                 expect(category).to.have.property('name').eq('Politics');
                 expect(category).to.have.property('created_date').eq('2019-01-11T19:54:17.694Z');
                 expect(category).to.have.property('last_updated_date').eq('2019-01-11T19:54:17.694Z');
                 //post
                 expect(category).to.have.property('posts');
                 const posts = category.posts;
                 expect(posts.length).eq(0);
               
            });
        });
    });
    

