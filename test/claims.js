const kraken = require('kraken-js');
const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;

const DegaLogger = require('../lib/logger');
const app = express();
const server = require('http').createServer(app);
const db = require('../lib/database');
let mock;

describe('/api/v1/claims', () => {
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

    it('Should get all claims', () => {
        return request(mock)
            .get('/api/v1/claims')
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const claims = JSON.parse(res.text);
                expect(claims.length).eq(3);
                const claim = claims[0];
                 // check for fields inside claims document
                 //expect(claim).to.have.property('_id').eq('ObjectId("5ce2682c682a3b2e077845ba")');
                 expect(claim).to.have.property('claim').eq('Broad Gauge line commissioned between the years 2009 and 2014 is 7,600 kms where as it is 9,528 kms between 2014 and 2018.');
                 expect(claim).to.have.property('description').eq('<p><strong>Has there been a 50% increase in track renewal?</strong></p><p>One of the claims is that there has been a 50% increase in track renewal in 2017-18 compared to 2013-14. In 2013-14, it was 2,926 kms and in 2017-18 it is 4,405 kms.</p><p>According the an&nbsp;<a href="http://164.100.47.190/loksabhaquestions/annex/13/AU1529.pdf" target="_blank" style="color: rgb(229, 78, 83);">answer</a>&nbsp;provided in the Lok Sabha,&nbsp;<em>‘railway tracks are replaced through track renewal works which is an ongoing process. Track renewal works are undertaken as and when stretch of track becomes due for renewal on the basis of criteria laid down in Indian Railway Permanent Way Manual on age/condition basis viz. traffic carried in terms of gross million tonnes, incidence of rail fracture/failure, wear of rails, corrosion of rails, maintainability of track as per standards, etc. Track Renewal works are planned in advance every year and their execution is prioritized according to the condition of track and overall availability of funds ensuring that track is in a sound condition all the time for safe running of trains. If any stretch of track is not renewed in time due to various reasons, suitable speed restrictions, if required, are imposed to ensure safe running of trains’</em></p><p><br></p><p>Track renewal data collated from the&nbsp;<a href="http://www.indianrailways.gov.in/railwayboard/view_section_new.jsp?lang=0&amp;id=0,1,304,366,554,941" target="_blank" style="color: rgb(229, 78, 83);">annual reports</a>&nbsp;of the ministry of railways, the&nbsp;<a href="https://data.gov.in/resources/zone-railway-wise-details-track-renewal-target-and-achievement-2014-15-2017-18-ministry" target="_blank" style="color: rgb(229, 78, 83);">open data portal of the government</a>,&nbsp;<a href="http://164.100.47.190/loksabhaquestions/annex/14/AU3102.pdf" target="_blank" style="color: rgb(229, 78, 83);">Lok Sabha</a>,&nbsp;<a href="http://164.100.158.235/question/annex/247/Au1428.docx" target="_blank" style="color: rgb(229, 78, 83);">Rajya Sabha</a>&nbsp;answers and a&nbsp;<a href="http://pib.gov.in/PressReleseDetail.aspx?PRID=1557756" target="_blank" style="color: rgb(229, 78, 83);">press release</a>&nbsp;of the government suggests that in 2013-14, 2885 kms of tracks were renewed. In 2017-18, the number is more than 4400 kms as per the above collated data. The average length of renewal however was 3357 kms a year during UPA-2 while it is 3027 kms a year during the first four years of the current government.</p>');
                 expect(claim).to.have.property('slug').eq('broad-gauge-line-commissioned-between-the-years-2009-and-2014-is-7600-kms-where-as-it-is-9528-kms-between-2014-and-2018');
                 expect(claim).to.have.property('client_id').eq('Factly');
                 expect(claim).to.have.property('created_date').eq('2019-01-15T19:39:07.478Z');
                 expect(claim).to.have.property('last_updated_date').eq('2019-01-15T19:39:07.478Z');
                 expect(claim).to.have.property('claim_date').eq('2018-12-12T06:00:00.000Z');
                 expect(claim).to.have.property('claim_source').eq('https://48months.mygov.in/wp-content/uploads/2018/05/10000000001249737483.png');
                 expect(claim).to.have.property('checked_date').eq('2019-01-15T06:00:00.000Z');
                 expect(claim).to.have.property('review_sources').eq('http://164.100.47.190/loksabhaquestions/annex/13/AU1529.pdf');
                 expect(claim).to.have.property('review').eq('Track renewal data collated from the annual reports of the ministry of railways, the open data portal of the government, Lok Sabha & Rajya Sabha answers suggests that in 2013-14, 2885 kms of tracks were renewed. In 2017-18, the number is more than 4000 kms as per the above collated data. Hence the claim is TRUE. However, the average length of renewal was 3357 kms a year during UPA-2 while it is 3027 kms a year during the first four years of the current government.');
               // rating
               // expect(claim).to.have.property('rating');
               // expect(claim.rating).to.have.property('slug').eq('false');
               // claimant
               // expect(claim).to.have.property('claimant');
               //expect(claim.claimant).to.have.property('slug').eq('government-of-india');
                //facthecks
                expect(claim).to.have.property('factchecks');
                const factchecks = claim.factchecks;
                expect(factchecks.length).eq(0);
            });
    });
});
