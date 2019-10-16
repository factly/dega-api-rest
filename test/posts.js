const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/posts', () => {
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

    it('Should get all posts', () => {
        return request(mock)
            .get('/api/v1/posts')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text);
                console.log(posts.data);
                expect(posts.data.length).eq(1);
                const post = posts.data[0];
                // check for fields inside categories document
                expect(post).to.have.property('id').eq('5ce3b35bcbcb3d64f8a2a46e');
                expect(post).to.have.property('featured').eq(true);
                expect(post).to.have.property('sticky').eq(false);
                expect(post).to.have.property('clientId').eq('factly');
                expect(post).to.have.property('title').eq('Why are discounted SMS rates not valid on certain days?');
                expect(post).to.have.property('content').eq('<p>Many of you might have received that customary message from your Telecom Service Provider (mobile operators) about discounted and free SMS rates not being valid on certain days.&nbsp;Why is that mobile operators charge normal rates on some specific days and not charge us the usual package rate on these days? The answer lies in&nbsp;<strong><em>‘Black Out Days’</em></strong>&nbsp;as listed by the respective service provider.</p><p><br></p><p><strong>Transparency in Tariff Offers</strong></p><p>The Telecom Regulatory Authority of India (TRAI), the apex regulatory body in the telecom sector issued&nbsp;<span style="color: rgb(229, 78, 83);">detailed direction in September, 2008</span>&nbsp;to all telecom service providers regarding transparency in their tariff offers. The direction was an outcome of large number of complaints from consumers and consumer organizations that the tariffs plans offered by the service providers are complex to understand and are confusing, which makes it difficult for consumers to make an informed choice.</p><p>TRAI initiated a consultation process on this issue and also held open house discussions before coming up with these directions. The directions were issued in four broad areas namely</p><ul><li>Directions relating to Key Tariff Information</li><li>Directions relating to Promotional Offers</li><li>Direction relating to condition or barrier in cases of migration from one plan to another in certain cases</li><li>Directions relating to Black out days</li></ul><p><br></p><p><strong>Key Tariff Information</strong></p><p>TRAI directed all telecom service providers to provide detailed information to consumers on each tariff plan offered by them in both Vernacular &amp; English language. The information about each plan should include the following:</p><ul><li>Title</li><li>Rental/Fixed Fee</li><li>Billing Cycle/Validity</li><li>Free Call Allowance/Talk time</li><li>Tariff per Unit for:</li><li class="ql-indent-1">Local Call</li><li class="ql-indent-1">STD</li><li class="ql-indent-1">ISD</li><li class="ql-indent-1">SMS</li><li class="ql-indent-1">National roaming</li></ul><p>Not just this, all this information has to be prominently displayed at all the retail outlets of the telecom service providers.</p><p><br></p><p><strong>Promotional Offers</strong></p><p>All the service providers must provide the following information to public with respect to any promotional offer,</p><ul><li>The eligibility criteria for such promotional offer</li><li>The opening and closing dates of such promotional offer</li><li><br></li></ul><p><strong>Barrier in cases of migration from one plan to another in certain cases</strong></p><p>No service provider should put any condition or barrier such as the requirement of obtaining new SIM or change of telephone number, etc., to a consumer who wishes to migrate across plans or across postpaid and prepaid platforms.</p><p><br></p><p><strong>The Black Out Days</strong></p><p>Coming to black out days, TRAI has allowed the service providers to fix a maximum of five (5) ‘black out’ days in a calendar year. ‘Black out’ days are those days on which free or concessional Voice Calls/SMS offered under any plan/ package including discounted rates are not valid. Normal rates will be applicable on these blackout days. In the beginning of each year, the telecom service providers are asked to specify the ‘black out’ days for that year. They are free to specify different set of dates for each telecom circle. Different service providers can fix different black out days. But once they are fixed, the dates cannot be modified. For example, the list of&nbsp;<span style="color: rgb(229, 78, 83);">black out days for 2018</span>&nbsp;has different days listed for different circles.</p>');
                expect(post).to.have.property('excerpt').eq('Why are discounted SMS rates not valid on certain days? What are the rules that govern these days? Can Mobile operators specify as many days as they wish?  Here is an explainer.');
                expect(post).to.have.property('lastUpdatedDate').eq('2019-01-30T12:20:38.282Z');
                expect(post).to.have.property('slug').eq('why-are-discounted-sms-rates-not-valid-on-certain-days');
                expect(post).to.have.property('createdDate').eq('2019-01-14T17:21:00.000Z');
                // tags
                expect(post).to.have.property('tags');
                const tags = post.tags;
                expect(tags.length).eq(1);
                const tag = tags[0];
                expect(tag).to.have.property('slug').eq('Bad-Loans');
                // categories
                expect(post).to.have.property('categories');
                const categories = post.categories;
                expect(categories.length).eq(1);
                const category = categories[0];
                expect(category).to.have.property('slug').eq('politics');
                // degausers
                expect(post).to.have.property('users');
                const degaUser = post.users;
                expect(degaUser.length).eq(2);
                const degaUsers = degaUser[1];
                expect(degaUsers).to.have.property('slug').eq('shashi-deshetti');
                // status
                expect(post).to.have.property('status');
                expect(post.status).to.have.property('slug').eq('publish');
               
                
            });
    });
});
