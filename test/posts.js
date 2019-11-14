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

    it('Should get status 422 when no client id is passed', () => {
        return request(mock)
            .get('/api/v1/posts')
            .expect(422)
    });

    it('Should get status 404 when random key is passed', () => {
        return request(mock)
            .get('/api/v1/posts/aaa8f470569ed47e00c7002c')
            .set({ client : 'factly'})
            .expect(404)         
    });

    it('Should get status 404 when random slug is passed', () => {
        return request(mock)
            .get('/api/v1/posts/random')
            .set({ client : 'factly'})
            .expect(404)         
    });

    it('Should get next 3 posts when limit is 3 & next is passed', () => {
        return request(mock)
            .get('/api/v1/posts?limit=3&next=W3siJGRhdGUiOiIyMDE5LTAxLTMwVDEyOjI3OjQwLjI4MloifSx7IiR1bmRlZmluZWQiOnRydWV9XQ')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text);
                expect(posts.data.length).eq(3);
            });
    });

    it('Should get previous 3 posts when limit is 3 & previous is passed ', () => {
        return request(mock)
            .get('/api/v1/posts?limit=3&previous=W3siJGRhdGUiOiIyMDE5LTAxLTMwVDEyOjIwOjM1LjI4MloifSx7IiR1bmRlZmluZWQiOnRydWV9XQ')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text);
                expect(posts.data.length).eq(3);
            });
    });

    it('Should get all posts', () => {
        return request(mock)
            .get('/api/v1/posts')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text);
                expect(posts.data.length).eq(8);
                const post = posts.data[0];
                // check for fields inside categories document
                expect(post).to.have.property('id').eq('5ce3b35bcbcb3d64f8a2a46e');
                expect(post).to.have.property('featured').eq(true);
                expect(post).to.have.property('sticky').eq(false);
                expect(post).to.have.property('clientId').eq('factly');
                expect(post).to.have.property('title').eq('Why are discounted SMS rates not valid on certain days?');
                expect(post).to.have.property('content').eq('<p>Many of you might have received that customary message from your Telecom Service Provider (mobile operators) about discounted and free SMS rates not being valid on certain days.&nbsp;Why is that mobile operators charge normal rates on some specific days and not charge us the usual package rate on these days? The answer lies in&nbsp;<strong><em>‘Black Out Days’</em></strong>&nbsp;as listed by the respective service provider.</p><p><br></p><p><strong>Transparency in Tariff Offers</strong></p><p>The Telecom Regulatory Authority of India (TRAI), the apex regulatory body in the telecom sector issued&nbsp;<span style="color: rgb(229, 78, 83);">detailed direction in September, 2008</span>&nbsp;to all telecom service providers regarding transparency in their tariff offers. The direction was an outcome of large number of complaints from consumers and consumer organizations that the tariffs plans offered by the service providers are complex to understand and are confusing, which makes it difficult for consumers to make an informed choice.</p><p>TRAI initiated a consultation process on this issue and also held open house discussions before coming up with these directions. The directions were issued in four broad areas namely</p><ul><li>Directions relating to Key Tariff Information</li><li>Directions relating to Promotional Offers</li><li>Direction relating to condition or barrier in cases of migration from one plan to another in certain cases</li><li>Directions relating to Black out days</li></ul><p><br></p><p><strong>Key Tariff Information</strong></p><p>TRAI directed all telecom service providers to provide detailed information to consumers on each tariff plan offered by them in both Vernacular &amp; English language. The information about each plan should include the following:</p><ul><li>Title</li><li>Rental/Fixed Fee</li><li>Billing Cycle/Validity</li><li>Free Call Allowance/Talk time</li><li>Tariff per Unit for:</li><li class="ql-indent-1">Local Call</li><li class="ql-indent-1">STD</li><li class="ql-indent-1">ISD</li><li class="ql-indent-1">SMS</li><li class="ql-indent-1">National roaming</li></ul><p>Not just this, all this information has to be prominently displayed at all the retail outlets of the telecom service providers.</p><p><br></p><p><strong>Promotional Offers</strong></p><p>All the service providers must provide the following information to public with respect to any promotional offer,</p><ul><li>The eligibility criteria for such promotional offer</li><li>The opening and closing dates of such promotional offer</li><li><br></li></ul><p><strong>Barrier in cases of migration from one plan to another in certain cases</strong></p><p>No service provider should put any condition or barrier such as the requirement of obtaining new SIM or change of telephone number, etc., to a consumer who wishes to migrate across plans or across postpaid and prepaid platforms.</p><p><br></p><p><strong>The Black Out Days</strong></p><p>Coming to black out days, TRAI has allowed the service providers to fix a maximum of five (5) ‘black out’ days in a calendar year. ‘Black out’ days are those days on which free or concessional Voice Calls/SMS offered under any plan/ package including discounted rates are not valid. Normal rates will be applicable on these blackout days. In the beginning of each year, the telecom service providers are asked to specify the ‘black out’ days for that year. They are free to specify different set of dates for each telecom circle. Different service providers can fix different black out days. But once they are fixed, the dates cannot be modified. For example, the list of&nbsp;<span style="color: rgb(229, 78, 83);">black out days for 2018</span>&nbsp;has different days listed for different circles.</p>');
                expect(post).to.have.property('excerpt').eq('Why are discounted SMS rates not valid on certain days? What are the rules that govern these days? Can Mobile operators specify as many days as they wish?  Here is an explainer.');
                expect(post).to.have.property('publishedDate').eq('2019-01-30T12:27:40.282Z');
                expect(post).to.have.property('lastUpdatedDate').eq('2019-01-30T12:27:40.282Z');
                expect(post).to.have.property('slug').eq('post1-tags-bad-loans-categories-politics-users-shashi-deshetti-rakesh-dubbudu');
                expect(post).to.have.property('createdDate').eq('2019-01-14T17:21:00.000Z');
                expect(post).to.have.property('class').eq('com.factly.dega.domain.Post');
                //media
                expect(post).to.have.property('media');
                const media = post.media;
                expect(media).to.have.property('slug').eq('shortfall-in-government-earnings_featured-image');
                // tags
                expect(post).to.have.property('tags');
                const tags = post.tags;
                expect(tags.length).eq(1);
                const tag = tags[0];
                expect(tag).to.have.property('slug').eq('bad-loans');
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
    it('Should get individual post by slug', () => {
        return request(mock)
            .get('/api/v1/posts/post2-tags-black-money-categories-india-stories-business-finance-users-shashi-deshetti')
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
                expect(post).to.have.property('lastUpdatedDate').eq('2019-01-30T12:25:40.282Z');
                expect(post).to.have.property('publishedDate').eq('2019-01-30T12:25:40.282Z');
                expect(post).to.have.property('slug').eq('post2-tags-black-money-categories-india-stories-business-finance-users-shashi-deshetti');
                expect(post).to.have.property('createdDate').eq('2018-09-28T12:12:56.481Z');
                expect(post).to.have.property('class').eq('com.factly.dega.domain.Post');
                // tags
                expect(post).to.have.property('tags');
                const tags = post.tags;
                expect(tags.length).eq(1);
                expect(tags[0]).to.have.property('slug').eq('black-money');
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

    it('Should get individual post by Object Id', () => {
        return request(mock)
            .get('/api/v1/posts/5d4aa7e494e10a0a035082ed')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text);
                expect(posts).to.have.property('data');
                const post = posts.data;
                // check for fields inside categories document
                expect(post).to.have.property('id').eq('5d4aa7e494e10a0a035082ed');
                expect(post).to.have.property('featured').eq(false);
                expect(post).to.have.property('sticky').eq(false);
                expect(post).to.have.property('subTitle').eq('');
                expect(post).to.have.property('updates').eq('');
                expect(post).to.have.property('clientId').eq('factly');
                expect(post).to.have.property('title').eq('Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...');
                expect(post).to.have.property('content').eq('<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce gravida justo massa, eget fermentum sapien hendrerit congue. Morbi mattis porttitor tellus ullamcorper sagittis. Mauris ac vehicula erat. Proin varius, augue non finibus scelerisque, diam enim tempus ante, eu molestie ante magna in metus. Nam posuere lorem auctor ipsum maximus scelerisque. Duis sit amet gravida dui, ut euismod risus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec sit amet risus suscipit, condimentum libero eget, ultrices tellus.</span></p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Nam vehicula lobortis lacus porttitor bibendum. Pellentesque laoreet pretium odio, sit amet semper tortor feugiat vel. Sed dignissim justo quis neque rhoncus elementum. Curabitur interdum, dolor non sodales rutrum, risus nisl porta ligula, nec malesuada sem ex in augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Maecenas ullamcorper turpis est, a interdum mi euismod nec. Proin placerat hendrerit purus, ac lobortis ante interdum eget. Vivamus a dolor vitae nisi hendrerit interdum. Phasellus ullamcorper lectus sit amet tellus elementum, eget pulvinar augue ultrices. Etiam aliquet vulputate magna vitae euismod.</span></p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam pulvinar vestibulum dictum. Etiam dapibus lectus eu neque sollicitudin sollicitudin. Donec ornare dignissim risus, ac auctor purus posuere eget. Suspendisse faucibus rhoncus neque, sit amet sagittis odio. Fusce quis nibh eget lectus convallis congue. Nullam ut orci lacus. Nam in tincidunt sapien, vel varius libero. Etiam in libero id nunc faucibus vulputate vitae laoreet nunc. Cras et porta lorem. Phasellus fringilla lectus vel magna auctor ultricies. Integer sed diam nec magna rhoncus posuere eu sed odio. Praesent lorem est, aliquet convallis libero nec, semper facilisis elit. Vestibulum luctus rutrum viverra. Vestibulum ut leo aliquam, posuere nisi eu, dignissim ante.</span></p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Maecenas sit amet rutrum ex, ut cursus libero. Curabitur condimentum finibus libero sit amet pellentesque. Aenean varius nulla at nibh tincidunt mattis. Mauris rhoncus ligula nulla, eget tempus urna tincidunt lobortis. Nunc diam nunc, ultrices in leo vel, congue ullamcorper justo. Nullam non sem quis augue ultricies sollicitudin. Etiam dolor dui, egestas quis semper eget, iaculis sit amet eros. Mauris tristique eros a arcu euismod, vel bibendum velit lacinia. Maecenas commodo justo a elit ornare, eget tempus nunc egestas. Fusce orci sapien, imperdiet et dolor quis, eleifend iaculis ante.</span></p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Nullam a libero eleifend, bibendum nibh et, fermentum lacus. Mauris vestibulum at lectus eu sodales. Nulla arcu ligula, mollis in enim nec, varius eleifend massa. Donec id sapien nec dolor rutrum tempor in mollis dolor. Ut faucibus vulputate nunc quis mollis. Nulla ligula felis, congue suscipit metus et, mattis hendrerit massa. Donec in consectetur purus, id congue ligula. Sed aliquam nunc ligula, in interdum dolor blandit eu. Fusce urna tortor, tempus eu scelerisque in, finibus vel nisl.</span></p><p><br></p>');
                expect(post).to.have.property('excerpt').eq('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce gravida justo massa, eget fermentum sapien hendrerit congue. Morbi mattis porttitor tellus ullamcorper sagittis. Mauris ac vehicula erat. Proin varius, augue non finibus scelerisque, diam enim tempus ante, eu molestie ante magna in metus. ');
                expect(post).to.have.property('lastUpdatedDate').eq('2019-01-30T12:22:36.282Z');
                expect(post).to.have.property('publishedDate').eq('2019-01-30T12:22:36.282Z');
                expect(post).to.have.property('slug').eq('post3-tags-crude-oil-bad-loans-categories-politics-elections-users-rakesh-dubbudu');
                expect(post).to.have.property('createdDate').eq('2018-08-07T10:28:52.718Z');
                expect(post).to.have.property('class').eq('com.factly.dega.domain.Post');
                // tags
                expect(post).to.have.property('tags');
                const tags = post.tags;
                expect(tags.length).eq(2);
                expect(tags[0]).to.have.property('slug').eq('crude-oil');
                expect(tags[1]).to.have.property('slug').eq('bad-loans');
                // categories
                expect(post).to.have.property('categories');
                const categories = post.categories;
                expect(categories.length).eq(2);
                const category = categories[0];
                expect(category).to.have.property('slug').eq('politics');
                // degausers
                expect(post).to.have.property('users');
                const degaUser = post.users;
                expect(degaUser.length).eq(1);
                const degaUsers = degaUser[0];
                expect(degaUsers).to.have.property('slug').eq('rakesh-dubbudu');
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

    it('Should get posts by query param tags', () => {
        return request(mock)
            .get('/api/v1/posts?tag=bad-loans')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text).data;
                expect(posts.length).eq(4);
                // check for fields inside categories document
                expect(posts[0]).to.have.property('slug').eq('post1-tags-bad-loans-categories-politics-users-shashi-deshetti-rakesh-dubbudu');
                expect(posts[1]).to.have.property('slug').eq('post3-tags-crude-oil-bad-loans-categories-politics-elections-users-rakesh-dubbudu');
                expect(posts[2]).to.have.property('slug').eq('post6-tags-bad-loans-child-sex-ratio-categories-crime-users-naresh-dubbudu-shashi-deshetti');
                expect(posts[3]).to.have.property('slug').eq('post8-tags-bad-loans-categories-sports-india-users-shashi-deshetti');

            });
    });

    it('Should get posts when more than one query param tags is passed', () => {
        return request(mock)
            .get('/api/v1/posts?tag=crude-oil&tag=child-sex-ratio')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text).data;
                expect(posts.length).eq(3);
                // check for fields inside categories document
                expect(posts[0]).to.have.property('slug').eq('post3-tags-crude-oil-bad-loans-categories-politics-elections-users-rakesh-dubbudu');
                expect(posts[1]).to.have.property('slug').eq('post6-tags-bad-loans-child-sex-ratio-categories-crime-users-naresh-dubbudu-shashi-deshetti');
                expect(posts[2]).to.have.property('slug').eq('post7-tags-child-sex-ratio-categories-finance-users-shashi-deshetti');                  
            });
    });

    it('Should get posts by query param category', () => {
        return request(mock)
            .get('/api/v1/posts?category=india')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text).data;
                expect(posts.length).eq(2);
                // check for fields inside categories document
                expect(posts[0]).to.have.property('slug').eq('post2-tags-black-money-categories-india-stories-business-finance-users-shashi-deshetti');
                expect(posts[1]).to.have.property('slug').eq('post8-tags-bad-loans-categories-sports-india-users-shashi-deshetti');                
            });
    });

    it('Should get posts when more than one query param category is passed', () => {
        return request(mock)
            .get('/api/v1/posts?category=crime&category=elections')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text).data;
                expect(posts.length).eq(3);
                // check for fields inside categories document
                expect(posts[0]).to.have.property('slug').eq('post3-tags-crude-oil-bad-loans-categories-politics-elections-users-rakesh-dubbudu');
                expect(posts[1]).to.have.property('slug').eq('post5-tags-black-money-categories-elections-users-surya-kandukuri');
                expect(posts[2]).to.have.property('slug').eq('post6-tags-bad-loans-child-sex-ratio-categories-crime-users-naresh-dubbudu-shashi-deshetti');                  
            });
    });

    it('Should get posts by query param user', () => {
        return request(mock)
            .get('/api/v1/posts?user=rakesh-dubbudu')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text).data;
                expect(posts.length).eq(2);
                // check for fields inside categories document
                expect(posts[0]).to.have.property('slug').eq('post1-tags-bad-loans-categories-politics-users-shashi-deshetti-rakesh-dubbudu');
                expect(posts[1]).to.have.property('slug').eq('post3-tags-crude-oil-bad-loans-categories-politics-elections-users-rakesh-dubbudu');                
            });
    });

    it('Should get posts when more than one query param user is passed', () => {
        return request(mock)
            .get('/api/v1/posts?user=surya-kandukuri&user=shashi-deshetti')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text).data;
                expect(posts.length).eq(6);
                // check for fields inside categories document
                expect(posts[0]).to.have.property('slug').eq('post1-tags-bad-loans-categories-politics-users-shashi-deshetti-rakesh-dubbudu');
                expect(posts[1]).to.have.property('slug').eq('post2-tags-black-money-categories-india-stories-business-finance-users-shashi-deshetti');
                expect(posts[2]).to.have.property('slug').eq('post5-tags-black-money-categories-elections-users-surya-kandukuri');   
                expect(posts[3]).to.have.property('slug').eq('post6-tags-bad-loans-child-sex-ratio-categories-crime-users-naresh-dubbudu-shashi-deshetti');
                expect(posts[4]).to.have.property('slug').eq('post7-tags-child-sex-ratio-categories-finance-users-shashi-deshetti');
                expect(posts[5]).to.have.property('slug').eq('post8-tags-bad-loans-categories-sports-india-users-shashi-deshetti');               
            });
    });

    it('Should get posts when more than one query param id is passed', () => {
        return request(mock)
            .get('/api/v1/posts?id=5ce3b35bcbcb3d64f8a2a46e&id=5d8f4e4893ace2000112a8b0')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text).data;
                expect(posts.length).eq(2);
                // check for fields inside categories document
                expect(posts[0]).to.have.property('slug').eq('post1-tags-bad-loans-categories-politics-users-shashi-deshetti-rakesh-dubbudu');
                expect(posts[1]).to.have.property('slug').eq('post2-tags-black-money-categories-india-stories-business-finance-users-shashi-deshetti');               
            });
    });

    it('Should get post by one query param id', () => {
        return request(mock)
            .get('/api/v1/posts?id=5d6db4c9df0479629ee50868')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text).data;
                expect(posts.length).eq(1);
                // check for fields inside categories document
                expect(posts[0]).to.have.property('slug').eq('post6-tags-bad-loans-child-sex-ratio-categories-crime-users-naresh-dubbudu-shashi-deshetti');               
            });
    });
    it('Should get posts more than one query param slug is passed', () => {
        return request(mock)
            .get('/api/v1/posts?slug=post1-tags-bad-loans-categories-politics-users-shashi-deshetti-rakesh-dubbudu&slug=post8-tags-bad-loans-categories-sports-india-users-shashi-deshetti')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const posts = JSON.parse(res.text).data;
                expect(posts.length).eq(2);
                // check for fields inside categories document
                expect(posts[0]).to.have.property('slug').eq('post1-tags-bad-loans-categories-politics-users-shashi-deshetti-rakesh-dubbudu');
                expect(posts[1]).to.have.property('slug').eq('post8-tags-bad-loans-categories-sports-india-users-shashi-deshetti');               
            });
    });
});
