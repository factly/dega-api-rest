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

    it('Should get status 422 when no client id', () => {
        return request(mock)
            .get('/api/v1/factchecks')
            .expect(422)
    });

    it('Should get all factchecks', () => {
        return request(mock)
            .get('/api/v1/factchecks')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const factchecks = JSON.parse(res.text);
                expect(factchecks).to.have.property('data');
                expect(factchecks.data.length).eq(3);
                const factcheck = factchecks.data[0];

                // check for fields inside factcheck document
                expect(factcheck).to.have.property('id').eq('5d717fcddf047986a5830098');
                expect(factcheck).to.have.property('clientId').eq('factly');
                expect(factcheck).to.have.property('featured').eq(false);
                expect(factcheck).to.have.property('introduction').eq('<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>');
                expect(factcheck).to.have.property('slug').eq('test-factcheck-title');
                expect(factcheck).to.have.property('title').eq('Test Factcheck title');
                expect(factcheck).to.have.property('summary').eq('<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>');
                expect(factcheck).to.have.property('createdDate').eq('2019-09-05T21:36:13.541Z');
                expect(factcheck).to.have.property('publishedDate').eq('2019-09-23T12:25:43.689Z');
                expect(factcheck).to.have.property('lastUpdatedDate').eq('2019-09-05T22:51:55.181Z');
                expect(factcheck).to.have.property('subTitle').eq('');
                expect(factcheck).to.have.property('updates').eq('');
                //expect(factcheck).to.have.property('featuredMedia');
                expect(factcheck).to.have.property('sticky').eq(false);
                expect(factcheck).to.have.property('excerpt').eq('Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor.');

                // check for expanded sub documents
                // users
                expect(factcheck).to.have.property('users');
                const users = factcheck.users;
                expect(users.length).eq(1);
                const author = users[0];
                expect(author).to.have.property('slug').eq('rakesh-dubbudu');

                // categories
                expect(factcheck).to.have.property('categories');
                const categories = factcheck.categories;
                expect(categories.length).eq(1);
                const category = categories[0];
                expect(category).to.have.property('slug').eq('india');

                // claims
                expect(factcheck).to.have.property('claims');
                const claims = factcheck.claims;
                expect(claims.length).eq(1);
                const claim = claims[0];
                expect(claim).to.have.property('claimSource').eq('https://twitter.com/INCIndia/status/1175386695757230080');

                // media
                expect(factcheck).to.have.property('media');
                const media = factcheck.media;
                expect(media).to.have.property('sourceURL').eq('https://images.degacms.com/dega-content/factly/2019/9/1569676519335-narendra-modi.png');

                // tags
                expect(factcheck).to.have.property('tags');
                const tags = factcheck.tags;
                expect(tags.length).eq(0);
            });
    });

    it('Should get factcheck by slug', () => {
        return request(mock)
            .get('/api/v1/factchecks/test-factcheck-title-2')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const factchecks = JSON.parse(res.text);
                expect(factchecks).to.have.property('data');
                const factcheck = factchecks.data;

                // check for fields inside factcheck document
                expect(factcheck).to.have.property('id').eq('5d718b016f5f0b0fc31d64d4');
                expect(factcheck).to.have.property('clientId').eq('factly');
                expect(factcheck).to.have.property('featured').eq(false);
                expect(factcheck).to.have.property('introduction').eq('<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>');
                expect(factcheck).to.have.property('slug').eq('test-factcheck-title-2');
                expect(factcheck).to.have.property('title').eq('Test Factcheck title - 2');
                expect(factcheck).to.have.property('summary').eq('<p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur magna urna, rhoncus nec mi ut, interdum luctus tellus. Ut interdum, nulla non commodo placerat, quam risus pellentesque nulla, non finibus enim nunc et felis. Pellentesque scelerisque est ex. Aliquam eleifend odio tortor, a pellentesque enim imperdiet at. Mauris tincidunt pharetra nisi, vitae tincidunt massa dictum nec. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sed semper mauris.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Morbi vitae lacus faucibus, iaculis augue id, auctor nisi. Quisque malesuada eleifend dolor, ac posuere felis. Praesent vel risus nunc. Praesent dapibus ante quis sapien cursus suscipit. Etiam pharetra diam quis nisi suscipit, eu fermentum lectus feugiat. Nullam a mollis sem. Pellentesque nec diam erat.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Cras in diam id quam faucibus molestie eu eget tortor. Sed euismod quam ac molestie tincidunt. Maecenas et eros pharetra justo laoreet vehicula. Donec condimentum massa ante, vitae placerat est finibus sit amet. Mauris lacinia elit sed nulla aliquet sagittis. Morbi eros orci, euismod ut aliquet nec, ultrices in risus. Aenean sollicitudin erat nec ex gravida, sed tristique est sagittis. Suspendisse ac bibendum mauris. Etiam rhoncus vestibulum lectus ut feugiat. Cras nec lorem eleifend, efficitur mi lacinia, iaculis ligula. Nam a massa a lectus placerat porta et porttitor mi.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor. Fusce mi dolor, volutpat vel augue quis, efficitur auctor nisi. Aliquam quam augue, malesuada vel tellus in, accumsan efficitur tellus.</span></p><p class=\"ql-align-justify\"><span style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 0);\">Etiam finibus dolor volutpat lectus efficitur venenatis. Aliquam vitae porttitor enim. Etiam vel ultricies nibh, quis pellentesque odio. Proin iaculis sodales felis ut commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis scelerisque lacinia nisi. Suspendisse mollis diam lacinia sodales faucibus. Quisque at tellus sit amet augue scelerisque tincidunt. Praesent in sollicitudin turpis. Sed convallis aliquam leo volutpat aliquet. Etiam id lectus diam. Morbi in libero eget magna aliquet dictum ut at nisl. Etiam in sem quis sapien bibendum placerat id vel turpis. Maecenas aliquet nunc posuere libero facilisis interdum in id lorem.</span></p><p><br></p>');
                expect(factcheck).to.have.property('createdDate').eq('2019-09-05T22:24:01.451Z');
                expect(factcheck).to.have.property('publishedDate').eq('2019-09-05T22:24:01.451Z');
                expect(factcheck).to.have.property('lastUpdatedDate').eq('2019-09-23T13:14:13.255Z');
                expect(factcheck).to.have.property('subTitle').eq('');
                expect(factcheck).to.have.property('updates').eq('');
                //expect(factcheck).to.have.property('featuredMedia');
                expect(factcheck).to.have.property('sticky').eq(false);
                expect(factcheck).to.have.property('excerpt').eq('Proin non justo justo. Vivamus sit amet sagittis elit, vel vestibulum ex. In ut ex in velit molestie cursus. Suspendisse venenatis ultrices nulla a vehicula. Nunc aliquet scelerisque libero eget suscipit. Aenean et mauris imperdiet, commodo lectus ac, sagittis tortor.');

                // check for expanded sub documents
                // users
                expect(factcheck).to.have.property('users');
                const users = factcheck.users;
                expect(users.length).eq(1);
                const author = users[0];
                expect(author).to.have.property('slug').eq('rakesh-dubbudu');

                // categories
                expect(factcheck).to.have.property('categories');
                const categories = factcheck.categories;
                expect(categories.length).eq(1);
                const category = categories[0];
                expect(category).to.have.property('slug').eq('india');

                // claims
                expect(factcheck).to.have.property('claims');
                const claims = factcheck.claims;
                expect(claims.length).eq(1);
                const claim = claims[0];
                expect(claim).to.have.property('claimSource').eq('https://48months.mygov.in/wp-content/uploads/2018/05/10000000001249737483.png');

                // media
                expect(factcheck).to.have.property('media');
                const media = factcheck.media;
                expect(media).to.have.property('sourceURL').eq('https://images.degacms.com/dega-content/factly/2019/9/1569676519335-narendra-modi.png');

                // tags
                expect(factcheck).to.have.property('tags');
                const tags = factcheck.tags;
                expect(tags.length).eq(0);
            });
    });
});
