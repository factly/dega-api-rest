const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/users', () => {
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

    it('Should get all users', () => {
        return request(mock)
            .get('/api/v1/users')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const users = JSON.parse(res.text);
                expect(users.data.length).eq(4);
                const user = users.data[3];
                expect(user).to.have.property('id').eq('5d792589bf1bce0001eda484');
                expect(user).to.have.property('class').eq('com.factly.dega.domain.DegaUser');
                expect(user).to.have.property('firstName').eq('Shashi Kiran');
                expect(user).to.have.property('lastName').eq('Deshetti');
                expect(user).to.have.property('displayName').eq('Shashi Deshetti');
                expect(user).to.have.property('createdDate').eq('2019-10-02T00:25:00.000Z');
                expect(user).to.have.property('description').eq('Shashi was always intrigued by the public good that technology can do. This is what prompted him to explore various data/information tool ideas. He graduated with a masters in computer science and has extensive experience in software project management. He is the in-house data scientist and guru, who oversees rolling out product prototypes and developing technology infrastructure. The products in development at Factly are open source and can be found at Factly’s Github page. Shashi is the CTO at Factly.');
                expect(user).to.have.property('slug').eq('shashi-deshetti');
                expect(user).to.have.property('email').eq('shashi@factly.in');
                //media
                expect(user).to.have.property('media');
                const media = user.media;
                expect(media).to.have.property('sourceURL').eq('https://images.degacms.com/dega-content/factly/2019/10/1569975255658-shashi-deshetti.jpg');
                //role_mappings
                expect(user).to.have.property('roleMappings');
                const roleMappings = user.roleMappings;
                expect(roleMappings.length).eq(1);
                expect(roleMappings[0]).to.have.property('name').eq('Factly - Administrator');
                //role
                expect(roleMappings[0]).to.have.property('role');
                const role = user.roleMappings[0].role;
                expect(role).to.have.property('name').eq('Administrator');
                //organization
                expect(roleMappings[0]).to.have.property('organization');
                const organization = user.roleMappings[0].organization;
                expect(organization).to.have.property('name').eq('Factly');
                
            });
    });
    it('Should get user by Object Id', () => {
        return request(mock)
            .get('/api/v1/users/5d79d0bebf1bce0001eda5e1')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const result = JSON.parse(res.text);
                console.log(res.text);
                const user = result.data;
                expect(user).to.have.property('id').eq('5d79d0bebf1bce0001eda5e1');
                expect(user).to.have.property('class').eq('com.factly.dega.domain.DegaUser');
                expect(user).to.have.property('firstName').eq('Rakesh');
                expect(user).to.have.property('lastName').eq('Dubbudu');
                expect(user).to.have.property('displayName').eq('Rakesh Dubbudu');
                expect(user).to.have.property('createdDate').eq('2019-09-12T04:59:00.000Z');
                expect(user).to.have.property('description').eq('Rakesh closely watched the \'Jan Satyagraha\' in 2012. The courage and conviction of the man who led it inspired him to make \'engagement and confrontation\' his core pricinciple. Rakesh is an Open Data evangelist and experienced transparency (RTI) campaigner in India who won the US State Department Fellowship in 2014. Rakesh graduated from National Institute of Technology (NIT), Warangal. He has immense knowledge and experience understanding government policy and data. He is a fearless leader with an empirical world-view. Rakesh is the Editorial Lead and the idea machine at Factly.');
                expect(user).to.have.property('slug').eq('rakesh-dubbudu');
                expect(user).to.have.property('email').eq('rakesh@factly.in');
                //media
                expect(user).to.have.property('media');
                const media = user.media;
                expect(media).to.have.property('sourceURL').eq('https://images.degacms.com/dega-content/factly/2019/10/1569975232551-rakesh-dubbudu.jpg');
                //role_mappings
                expect(user).to.have.property('roleMappings');
                const roleMappings = user.roleMappings;
                expect(roleMappings.length).eq(1);
                expect(roleMappings[0]).to.have.property('name').eq('Factly - Administrator');
                //role
                expect(roleMappings[0]).to.have.property('role');
                const role = user.roleMappings[0].role;
                expect(role).to.have.property('name').eq('Administrator');
                //organization
                expect(roleMappings[0]).to.have.property('organization');
                const organization = user.roleMappings[0].organization;
                expect(organization).to.have.property('name').eq('Factly');
            });
    });
    it('Should get user by Slug', () => {
        return request(mock)
            .get('/api/v1/users/surya-kandukuri')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const result = JSON.parse(res.text);
                const user = result.data;
                expect(user).to.have.property('id').eq('5d93ee9277b1b80001d5724c');
                expect(user).to.have.property('class').eq('com.factly.dega.domain.DegaUser');
                expect(user).to.have.property('firstName').eq('Surya');
                expect(user).to.have.property('lastName').eq('Kandukuri');
                expect(user).to.have.property('displayName').eq('Surya Kandukuri');
                expect(user).to.have.property('createdDate').eq('2019-09-11T16:49:00.000Z');
                expect(user).to.have.property('description').eq('Surya is an IT professional who completed his Business Analytics course from the Indian School of Business (ISB), Hyderabad. He leads our Open Data projects. He works on mining insights and creating data tools from the data in the public domain, and collaborates with the Government of Telangana to make their public data open source. Sometimes, he feels trapped in the rectangular box of excel sheets and sometimes, dances in it. He is very interested in philosophy, languages, poetry, art, photography and music.');
                expect(user).to.have.property('slug').eq('surya-kandukuri');
                expect(user).to.have.property('email').eq('surya@factly.in');
                //media
                expect(user).to.have.property('media');
                const media = user.media;
                expect(media).to.have.property('sourceURL').eq('https://images.degacms.com/dega-content/factly/2019/10/1569975971440-surya.jpg');
                //role_mappings
                expect(user).to.have.property('roleMappings');
                const roleMappings = user.roleMappings;
                expect(roleMappings.length).eq(1);
                expect(roleMappings[0]).to.have.property('name').eq('Factly - Author');
                //role
                expect(roleMappings[0]).to.have.property('role');
                const role = user.roleMappings[0].role;
                expect(role).to.have.property('name').eq('Author');
                //organization
                expect(roleMappings[0]).to.have.property('organization');
                const organization = user.roleMappings[0].organization;
                expect(organization).to.have.property('name').eq('Factly');
                
            });
    });    
});
