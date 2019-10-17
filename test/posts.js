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

    it('Should get status 422 when no client id', () => {
        return request(mock)
            .get('/api/v1/posts')
            .expect(422)
    });

    it('Should get all posts', () => {
        return request(mock)
            .get('/api/v1/posts')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text);
                expect(posts.data.length).eq(2);
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
                expect(post).to.have.property('class').eq('com.factly.dega.domain.Post');
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
    it('Should get post by slug', () => {
        return request(mock)
            .get('/api/v1/posts/between-2016-2018,-more-than-100-crore-paid-in-compensation-for-complaints-against-airlines')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text);
                expect(posts).to.have.property('data');
                const post = posts.data;
                // check for fields inside categories document
                expect(post).to.have.property('id').eq('5d8f4e4893ace2000112a8b0');
                expect(post).to.have.property('featured').eq(false);
                expect(post).to.have.property('sticky').eq(false);
                expect(post).to.have.property('subTitle').eq('');
                expect(post).to.have.property('updates').eq('');
                expect(post).to.have.property('clientId').eq('factly');
                expect(post).to.have.property('title').eq('Between 2016 & 2018, more than ₹ 100 crore paid in Compensation for complaints against Airlines?');
                expect(post).to.have.property('content').eq('<p><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">With more and more people choosing to travel by air every year, the Directorate General of Civil Aviation (DGCA) released a </span><a href=\"http://www.civilaviation.gov.in/sites/default/files/Passenger%20Charter%20MoCA%20India%20Feb%202019.pdf\" target=\"_blank\" style=\"background-color: rgb(255, 255, 255); color: rgb(229, 78, 83);\">‘Passenger Charter’</a><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">, or a ‘Know Your Rights’ document for the passengers aiming to make air travel efficient, fair and approachable. This document was released in February this year at the ‘</span><a href=\"https://pib.gov.in/PressReleseDetail.aspx?PRID=1566517\" target=\"_blank\" style=\"background-color: rgb(255, 255, 255); color: rgb(229, 78, 83);\">Aviation Conclave</a><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">’ themed ‘Flying for all’.</span></p><p><br></p><p><span style=\"color: rgb(59, 59, 59);\">The charter enlightens flyers all with their rights when a flight is cancelled, delayed, diverted and in other emergencies. Factly had </span><a href=\"https://factly.in/what-are-your-rights-as-an-air-traveller/\" target=\"_blank\" style=\"color: rgb(229, 78, 83); background-color: rgb(255, 255, 255);\">earlier written</a><span style=\"color: rgb(59, 59, 59); background-color: rgb(255, 255, 255);\">in detail about this charter.</span></p><p><span style=\"color: rgb(59, 59, 59);\">We look at the complaints received, nature of complaints and action taken with respect to facilities provided to flight passengers in this story.</span></p><p><br></p><p><strong style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">The number of domestic passengers has doubled from 6 crores in 2014 to about 12 crores in 2018</strong></p><p><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">In the period between January and July 2019 alone, 8.26 crore </span><a href=\"http://dgca.nic.in/reports/Traffic-ind.htm\" target=\"_blank\" style=\"background-color: rgb(255, 255, 255); color: rgb(229, 78, 83);\">passengers</a><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">were carried by domestic airlines. This is an increase of 3.2% compared to the same period last year.</span></p><p><span style=\"color: rgb(59, 59, 59);\">In fact, the total number of domestic passengers has doubled from around 6 crores in 2014 to about 12 crores in 2018. While the number of passengers has increased manifold over the years, what about the numbers related to complaints?</span></p><p><br></p><p><strong style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">A total of 30,433 complaints have been registered from 2016 till May 2019</strong></p><p><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">Annually, thousands of </span><a href=\"http://164.100.24.220/loksabhaquestions/annex/171/AU5297.pdf\" target=\"_blank\" style=\"background-color: rgb(255, 255, 255); color: rgb(229, 78, 83);\">complaints</a><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">are lodged against airlines for various reasons. Data provided by the Ministry of Civil Aviation in the Lok Sabha shows that from 2016 to 2018, the number of complaints has reduced. In the year 2016, a total of 9772 complaints were received. The number of complaints went down by 15% in 2017 (8293 complaints) and by a further 18% in 2018 (6820 complaints). The number for 2019 is expected to be more than the 2018 figure since 5548 complaints have already been lodged in just 5 months till May 2019.</span></p><p><br></p><p><img src=\"https://images.degacms.com/dega-content/factly/2019/9/1569672453487-complaints-against-airlines_complaints-against-airlines-annual-number.jpg\"></p><p><br></p><p><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">The complaints are registered for varied reasons like baggage, catering, customer service, facilities to the disabled, refund, fare, flight problem, behaviour of staff and more.</span></p><p><br></p><p><strong style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">30% of complaints are related to flight problems, 25% about customer service and 22% regarding baggage</strong></p><p><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">The maximum number of complaints lodged every year is related to flight problem like delay, cancellation etc. Of the total 30,433 complaints in the last three years, 30% of them fall under this category. Annually, an average of 2,294 cases registered are related to flight problems like delay etc. Complaints related to customer service are the next in line. Issues such as improper treatment, threats and more fall under this category. Such complaints comprise 25% of the total complaints. Baggage related issues such as loss, damage and misplacement amount to 22% of the complaints. Apart from these, issues related to catering, persons with disability, fare, refund and others together amount to the remaining 23% of the complaints. The annual number of complaints received in each of these categories from 2016 to May 2019 is in the following chart.</span></p><p><br></p><p><img src=\"https://images.degacms.com/dega-content/factly/2019/9/1569672524826-complaints-against-airlines_complaints-against-airlines-annual-number-by-type.jpg\"></p><p><strong style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">From 2016-2018, more than₹106 crores paid in Compensation</strong></p><p><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">The resolution in most of these complaints has been compensation in terms of refunds or providing facilities. While most of the airlines provide alternate facilities to deal with the concerns of passengers, a look at the money spent on compensation reveals that every year, substantial amounts of money is spent on compensation for issues related to flight delays, denied boarding and flight cancellations. In 2016, ₹ 22.1 crores was spent on compensation. In the following years, 2017 and 2018, ₹ 45.6 crores and ₹ 40.7 crores was spent. For the year 2019, till May 2019, ₹ 19.2 crores has been spent. Compensation has been the largest for denied boarding where ₹ 68.2 crores has been spent for compensating for denied boarding. Flight delays has resulted in a compensation of ₹ 42.1 crores. Compensation paid for flight cancellation has amounted to ₹ 17.3 crores. It has to be noted that though the number of complaints has reduced from 2016 to 2017, the total compensation amount has almost doubled in 2017.</span></p><p><br></p><p><img src=\"https://images.degacms.com/dega-content/factly/2019/9/1569672571046-complaints-against-airlines_total-annual-compensation-paid-by-category.jpg\"></p><p><br></p><p><strong style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">The passenger charter clearly lays down the rights of Flyers</strong></p><p><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">The passenger charter clearly lays down the rights of flyers and provides details of all the facilities to be provided to passengers.&nbsp;For instance, for a delay of flight by more than four hours, the airlines must provide food or refreshments to the passengers. If the delay is more than six hours it is mandatory that the airline informs the passengers a day in advance.&nbsp;There are many other such provisions in the passenger charter. You can read more about them </span><a href=\"https://factly.in/what-are-your-rights-as-an-air-traveller/\" target=\"_blank\" style=\"background-color: rgb(255, 255, 255); color: rgb(229, 78, 83);\">here</a><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">.</span></p><p><br></p><p><strong style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">‘Airsewa’ launched to register grievances</strong></p><p><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">In order to make it simpler for people to file complaints and also provide information about flights, the Government of India launched the </span><a href=\"https://airsewa.gov.in/home\" target=\"_blank\" style=\"background-color: rgb(255, 255, 255); color: rgb(229, 78, 83);\">Airsewa</a><span style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">portal and a mobile application in November 2016. Further, one can also file a grievance using #Airsewa on social media platforms such as Facebook and Twitter.</span></p><p><br></p><p><img src=\"https://images.degacms.com/dega-content/factly/2019/9/1569672633443-complaints-against-airlines_airsewa.jpg\"></p><p><br></p><p><strong style=\"background-color: rgb(255, 255, 255); color: rgb(59, 59, 59);\">Featured Image: </strong><a href=\"http://images.newindianexpress.com/uploads/user/imagelibrary/2019/2/24/w900X450/KARMAY352_04-06-2018_12_49_48.jpg\" target=\"_blank\" style=\"background-color: rgb(255, 255, 255); color: rgb(229, 78, 83);\">Compensation for complaints against Airlines﻿</a></p><p><br></p>');
                expect(post).to.have.property('excerpt').eq('As more & more people travel by air, a centralized & simple to use grievance system is necessary. The Government has launched the ‘Air Sewa’ portal & also published a charter of passenger rights towards this end. Government data indicates that a total of more than ₹ 100 crore has been paid in compensation for complaints against Airlines between 2016 & 2018.');
                expect(post).to.have.property('lastUpdatedDate').eq('2019-10-03T18:20:09.572Z');
                expect(post).to.have.property('publishedDate').eq('2019-10-03T18:20:09.572Z');
                expect(post).to.have.property('slug').eq('between-2016-2018,-more-than-100-crore-paid-in-compensation-for-complaints-against-airlines');
                expect(post).to.have.property('createdDate').eq('2019-09-28T12:12:56.481Z');
                expect(post).to.have.property('class').eq('com.factly.dega.domain.Post');
                // tags
                expect(post).to.have.property('tags');
                const tags = post.tags;
                expect(tags.length).eq(0);
                // categories
                expect(post).to.have.property('categories');
                const categories = post.categories;
                expect(categories.length).eq(4);
                const category = categories[0];
                expect(category).to.have.property('slug').eq('business');
                // degausers
                expect(post).to.have.property('users');
                const degaUser = post.users;
                expect(degaUser.length).eq(1);
                const degaUsers = degaUser[0];
                expect(degaUsers).to.have.property('slug').eq('shashi-deshetti');
                // status
                expect(post).to.have.property('status');
                expect(post.status).to.have.property('slug').eq('publish');  
                // formats
                expect(post).to.have.property('format');
                expect(post.format).to.have.property('name').eq('Video');   
                // media
                expect(post).to.have.property('media');
                expect(post.media).to.have.property('title').eq('shortfall-in-government-earnings_Featured-Image');
            });
    });
});
