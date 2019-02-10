
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const _ = require('lodash');

class FactcheckModel extends MongoBase {
    /**
     * Creates a new FactcheckModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'factcheck');
    }

    getQueryObject(clientId, slug) {
        const queryObj = {};
        if (clientId) {
            queryObj.client_id = clientId;
        }

        if (slug) {
            queryObj.slug = slug;
        }
        return queryObj;
    }

    getFactcheck(config, clientId, slug, tagSlug, categorySlug, claimantSlug, userSlug) {

        // get query object
        const queryObj = this.getQueryObject(clientId, slug);

        const database = config.get('databaseConfig:databases:factcheck');
        const coreDatabase = config.get('databaseConfig:databases:core');
        return Q(this.collection(database).find(queryObj).toArray())
            .then((facts) => {
                this.logger.info('Retrieved the results');

                const workers = [];
                facts.forEach((fact) => {
                    const claimsWorkers = [];
                    if (fact.claims) {
                        const claims = fact.claims;
                        claims.forEach((claim) => {
                            claimsWorkers.push(Q(this.collection(database, claim.namespace).findOne({_id: claim.oid})));
                        });
                    }
                    const promiseChain = Q.all(claimsWorkers)
                        .then((claims) => {
                            const claimPromises = claims.map((claim) => {
                                // TODO: single promise fails to retrieve, fix it later
                                const workers = [];
                                if(claim.rating) {
                                    workers.push(Q(this.collection(database, claim.rating.namespace).findOne({_id: claim.rating.oid})));
                                }
                                return Q.all(workers).then((rating) => {
                                    if (rating && rating.length > 0) {
                                        claim.rating = rating[0];
                                    }

                                    if(!claim.claimant) {
                                        return Q();
                                    }

                                    const claimant = claim.claimant;
                                    return Q(this.collection(database, claimant.namespace).findOne({_id: claimant.oid}));
                                }).then((claimant) => {
                                    claim.claimant = claimant;
                                    return claim;
                                });
                            });

                            return Q.all(claimPromises);
                        }).then((claims) => {
                            const claimantSlugs = claims.map(c => c.claimant.slug);
                            const isClaimantFound = claimantSlugs.includes(claimantSlug);
                            if (claimantSlug && !isClaimantFound) {
                                throw Error('SkipFactCheck');
                            }
                            fact.claims = claims;

                            // get all tags
                            const tagPromises = (fact.tags || []).map((t) =>
                                Q(this.collection(coreDatabase, t.namespace).findOne({_id: t.oid})));
                            return Q.all(tagPromises);
                        }).
                        then((tags) => {
                            const tagSlugs = tags.map(t => t.slug);
                            const isTagFound = tagSlugs.includes(tagSlug);
                            if (tagSlug && !isTagFound) {
                                throw Error('SkipFactCheck');
                            }
                            fact.tags = tags;

                            // get all categories
                            const categoriesPromises = (fact.categories || []).map((c) =>
                                Q(this.collection(coreDatabase, c.namespace).findOne({_id: c.oid})));
                            return Q.all(categoriesPromises);
                        }).
                        then((categories) => {
                            const categorySlugs = categories.map(t => t.slug);
                            const isCategoryFound = categorySlugs.includes(categorySlug);
                            if (categorySlug && !isCategoryFound) {
                                throw Error('SkipFactCheck');
                            }
                            fact.categories = categories;

                            // get all dega users
                            const degaUserPromises = (fact.degaUsers || []).map((u) =>
                                Q(this.collection(coreDatabase, u.namespace).findOne({_id: u.oid})));
                            return Q.all(degaUserPromises);
                        }).
                        then((degaUsers) => {
                            const degaUserSlugs = degaUsers.map(u => u.slug);
                            const isDegaUserFound = degaUserSlugs.includes(userSlug);
                            if (userSlug && !isDegaUserFound) {
                                throw Error('SkipFactCheck');
                            }
                            fact.degaUsers = degaUsers;
                            return fact;
                        }).
                        catch((err) => {
                            if (err && err.message === 'SkipFactCheck') {
                                return null;
                            }
                            throw err;
                        });
                    workers.push(promiseChain);
                });
                return Q.all(workers);
            }).then(factchecks => _.compact(factchecks));
    }
}

module.exports = FactcheckModel;
