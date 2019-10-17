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

    it('Should get status 422 when no client id', () => {
        return request(mock)
            .get('/api/v1/claims')
            .expect(422)
    });

    it('Should get all claims', () => {
        return request(mock)
            .get('/api/v1/claims')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const claims = JSON.parse(res.text);
                expect(claims).to.have.property('data');
                expect(claims.data.length).eq(4);
                const claim = claims.data[0];
                // check for fields inside claims document
                expect(claim).to.have.property('id').eq('5ce2682c682a3b2e077845ba');
                expect(claim).to.have.property('claim').eq('Broad Gauge line commissioned between the years 2009 and 2014 is 7,600 kms where as it is 9,528 kms between 2014 and 2018.');
                expect(claim).to.have.property('description').eq('<p><strong>Has there been a 50% increase in track renewal?</strong></p><p>One of the claims is that there has been a 50% increase in track renewal in 2017-18 compared to 2013-14. In 2013-14, it was 2,926 kms and in 2017-18 it is 4,405 kms.</p><p>According the an&nbsp;<a href="http://164.100.47.190/loksabhaquestions/annex/13/AU1529.pdf" target="_blank" style="color: rgb(229, 78, 83);">answer</a>&nbsp;provided in the Lok Sabha,&nbsp;<em>‘railway tracks are replaced through track renewal works which is an ongoing process. Track renewal works are undertaken as and when stretch of track becomes due for renewal on the basis of criteria laid down in Indian Railway Permanent Way Manual on age/condition basis viz. traffic carried in terms of gross million tonnes, incidence of rail fracture/failure, wear of rails, corrosion of rails, maintainability of track as per standards, etc. Track Renewal works are planned in advance every year and their execution is prioritized according to the condition of track and overall availability of funds ensuring that track is in a sound condition all the time for safe running of trains. If any stretch of track is not renewed in time due to various reasons, suitable speed restrictions, if required, are imposed to ensure safe running of trains’</em></p><p><br></p><p>Track renewal data collated from the&nbsp;<a href="http://www.indianrailways.gov.in/railwayboard/view_section_new.jsp?lang=0&amp;id=0,1,304,366,554,941" target="_blank" style="color: rgb(229, 78, 83);">annual reports</a>&nbsp;of the ministry of railways, the&nbsp;<a href="https://data.gov.in/resources/zone-railway-wise-details-track-renewal-target-and-achievement-2014-15-2017-18-ministry" target="_blank" style="color: rgb(229, 78, 83);">open data portal of the government</a>,&nbsp;<a href="http://164.100.47.190/loksabhaquestions/annex/14/AU3102.pdf" target="_blank" style="color: rgb(229, 78, 83);">Lok Sabha</a>,&nbsp;<a href="http://164.100.158.235/question/annex/247/Au1428.docx" target="_blank" style="color: rgb(229, 78, 83);">Rajya Sabha</a>&nbsp;answers and a&nbsp;<a href="http://pib.gov.in/PressReleseDetail.aspx?PRID=1557756" target="_blank" style="color: rgb(229, 78, 83);">press release</a>&nbsp;of the government suggests that in 2013-14, 2885 kms of tracks were renewed. In 2017-18, the number is more than 4400 kms as per the above collated data. The average length of renewal however was 3357 kms a year during UPA-2 while it is 3027 kms a year during the first four years of the current government.</p>');
                expect(claim).to.have.property('slug').eq('broad-gauge-line-commissioned-between-the-years-2009-and-2014-is-7600-kms-where-as-it-is-9528-kms-between-2014-and-2018');
                expect(claim).to.have.property('clientId').eq('factly');
                expect(claim).to.have.property('createdDate').eq('2019-01-15T19:39:07.478Z');
                expect(claim).to.have.property('lastUpdatedDate').eq('2019-01-15T19:39:07.478Z');
                expect(claim).to.have.property('claimDate').eq('2018-12-12T06:00:00.000Z');
                expect(claim).to.have.property('claimSource').eq('https://48months.mygov.in/wp-content/uploads/2018/05/10000000001249737483.png');
                expect(claim).to.have.property('checkedDate').eq('2019-01-15T06:00:00.000Z');
                expect(claim).to.have.property('reviewSources').eq('http://164.100.47.190/loksabhaquestions/annex/13/AU1529.pdf');
                expect(claim).to.have.property('review').eq('Track renewal data collated from the annual reports of the ministry of railways, the open data portal of the government, Lok Sabha & Rajya Sabha answers suggests that in 2013-14, 2885 kms of tracks were renewed. In 2017-18, the number is more than 4000 kms as per the above collated data. Hence the claim is TRUE. However, the average length of renewal was 3357 kms a year during UPA-2 while it is 3027 kms a year during the first four years of the current government.');
                // rating
                expect(claim).to.have.property('rating');
                expect(claim.rating).to.have.property('slug').eq('false');
                // claimant
                expect(claim).to.have.property('claimant');
                expect(claim.claimant).to.have.property('slug').eq('government-of-india');
            });
    });
    /*
    it('Should get claim by Object Id', () => {
        return request(mock)
            .get('/api/v1/claims/5c3e3762569ed47d9451942b')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const result = JSON.parse(res.text);
                const claim = result.data[0];
                // check for fields inside claims document
                expect(claim).to.have.property('id').eq('5c3e3762569ed47d9451942b');
                expect(claim).to.have.property('claim').eq('Broad Gauge line commissioned between the years 2009 and 2014 is 7,600 kms where as it is 9,528 kms between 2014 and 2018.');
                expect(claim).to.have.property('description').eq('<p>Another claim is that broad gauge line commissioned between the years 2009 and 2014 is 7,600 kms where as it is 9,528 kms between 2014 and 2018.</p><p>Commissioning of broad gauge railway lines includes the following,</p><ul><li>Construction of New Lines</li><li>Gauge Conversion</li><li>Doubling</li></ul><p>The Indian Railways considers all the three together as the number of kms of commissioned broad gauge lines.</p><p>Data regarding broad gauge lines commissioned is collated from the&nbsp;<a href=\"http://pib.gov.in/PressReleseDetail.aspx?PRID=1557756\" target=\"_blank\" style=\"color: rgb(229, 78, 83);\">press release</a>&nbsp;of the Press Information Bureau and the&nbsp;<a href=\"http://www.indianrailways.gov.in/railwayboard/view_section_new.jsp?lang=0&amp;id=0,1,304,366,554,941\" target=\"_blank\" style=\"color: rgb(229, 78, 83);\">annual reports</a>&nbsp;of the Ministry of Railways. However, there is wide variation between the numbers mentioned in the press release and the data from the annual reports. As per the press release of the government, the annual average during the UPA-2 (2009-14) is 1520 kms where as it is 2049 kms as per the annual reports of the Ministry of Railways. As per the annual reports, the total broad gauge line commissioned during the UPA-2 (2009-14) is 10244.32 kms where as it is only 7600 kms as per the press release. Because of these varied numbers, this claim cannot be verified.</p>');
                expect(claim).to.have.property('slug').eq('broad-gauge-line-commissioned-between-the-years-2009-and-2014-is-7600-kms-where-as-it-is-9528-kms-between-2014-and-20181');
                expect(claim).to.have.property('clientId').eq('factly');
                expect(claim).to.have.property('createdDate').eq('2019-01-15T19:41:22.742Z');
                expect(claim).to.have.property('lastUpdatedDate').eq('2019-01-15T19:41:22.742Z');
                expect(claim).to.have.property('claimDate').eq('2018-12-12T06:00:00.000Z');
                expect(claim).to.have.property('claimSource').eq('https://48months.mygov.in/wp-content/uploads/2018/05/10000000001249737483.png');
                expect(claim).to.have.property('checkedDate').eq('2019-01-15T06:00:00.000Z');
                expect(claim).to.have.property('reviewSources').eq('http://pib.gov.in/PressReleseDetail.aspx?PRID=1557756, http://www.indianrailways.gov.in/railwayboard/view_section_new.jsp?lang=0&id=0,1,304,366,554,941');
                expect(claim).to.have.property('review').eq('There is wide variation between the numbers mentioned in the press release of the government and the data from the annual reports. As per the press release of the government, the annual average during the UPA-2 (2009-14) is 1520 kms where as it is 2049 kms as per the annual reports of the Ministry of Railways. Because of these varied numbers, this claim remains UNVERIFIED.');
                // rating
                expect(claim).to.have.property('rating');
                expect(claim.rating).to.have.property('slug').eq('unverified');
                // claimant
                expect(claim).to.have.property('claimant');
                expect(claim.claimant).to.have.property('slug').eq('government-of-india');
            });
    });
    */
    it('Should get claim by Slug', () => {
        return request(mock)
            .get('/api/v1/claims/the-number-of-consequential-train-accidents-reduced-to-62-in-201718-compared-to-201314-the-claim-also-states-that-118-accidents-were-recorded-in-201314-whereas-only-72-accidents-were-recorded-in-201718')
            .set({ client : 'factly'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
                const result = JSON.parse(res.text);
                const claim = result.data;
                // check for fields inside claims document
                expect(claim).to.have.property('id').eq('5c3e3988569ed47d94519432');
                expect(claim).to.have.property('claim').eq('The number of consequential train accidents reduced to 62% in 2017-18 compared to 2013-14. The claim also states that 118 accidents were recorded in 2013-14 whereas only 72 accidents were recorded in 2017-18.');
                expect(claim).to.have.property('description').eq('<p><strong>Have consequential&nbsp;train accidents reduced during the current government?</strong></p><p>The last of the claims is that the number of consequential train accidents reduced to 62% in 2017-18 compared to 2013-14. The claim also states that 118 accidents were recorded in 2013-14 whereas only 72 accidents were recorded in 2017-18.</p><p>As per the&nbsp;<a href=\"http://indianrailways.gov.in/railwayboard/uploads/directorate/safety/downloads/ch1-eng-0405.PDF\" target=\"_blank\" style=\"color: rgb(229, 78, 83);\">definition</a>&nbsp;of Indian Railways, the term ‘accident’ envelopes a wide spectrum of occurrences with or without significant impact on the system. On the other hand,&nbsp;<strong><em>Consequential train accidents</em></strong>&nbsp;include mishaps with serious repercussion in terms of loss of human life or injury, damage to railway property or interruption to rail traffic of laid down threshold levels and values. Such consequential train accidents include collisions, derailments, fire or explosion in trains, road vehicles colliding with trains at level crossings, and certain specified types of ‘miscellaneous’ train mishaps. In other words, not all accidents/incidents involving trains or at level crossings are counted as consequential train accidents. The data mentioned in the claim is consequential train accidents and these usually cover most of the serious accidents.</p><p>According to the data available in the&nbsp;<a href=\"http://www.indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&amp;id=0,1,304,366,554\" target=\"_blank\" style=\"color: rgb(229, 78, 83);\">annual statistical publication &amp; the year book</a>&nbsp;of the Indian Railways, there were 118 consequential train accidents in the year 2013-14 and 73 such accidents in the year 2017-18.&nbsp;While these numbers are true, this is only half the story. The number of consequential train accidents have been declining since 2003-04 except for 2014-15 when the number of accidents increased sharply compared to the previous year. It remains to be seen whether this decreasing trend continues in the years to come.</p>');
                expect(claim).to.have.property('slug').eq('the-number-of-consequential-train-accidents-reduced-to-62-in-201718-compared-to-201314-the-claim-also-states-that-118-accidents-were-recorded-in-201314-whereas-only-72-accidents-were-recorded-in-201718');
                expect(claim).to.have.property('clientId').eq('factly');
                expect(claim).to.have.property('createdDate').eq('2019-01-15T19:50:32.232Z');
                expect(claim).to.have.property('lastUpdatedDate').eq('2019-01-15T19:50:32.232Z');
                expect(claim).to.have.property('claimDate').eq('2018-12-12T06:00:00.000Z');
                expect(claim).to.have.property('claimSource').eq('https://48months.mygov.in/wp-content/uploads/2018/05/10000000001249737483.png');
                expect(claim).to.have.property('checkedDate').eq('2019-01-15T06:00:00.000Z');
                expect(claim).to.have.property('reviewSources').eq('http://www.indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,554');
                expect(claim).to.have.property('review').eq('There were 118 consequential train accidents in the year 2013-14 and 73 such accidents in the year 2017-18.  While these numbers are TRUE, this is only half the story. The number of consequential train accidents have been declining since 2003-04 except for 2014-15 when the number of accidents increased sharply compared to the previous year.');
                // rating
                expect(claim).to.have.property('rating');
                expect(claim.rating).to.have.property('slug').eq('partly-true');
                // claimant
                expect(claim).to.have.property('claimant');
                expect(claim.claimant).to.have.property('slug').eq('government-of-india');
            });
    });
});
