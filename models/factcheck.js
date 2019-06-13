const MongoPaging = require('mongo-cursor-pagination');
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;
const utils = require('../lib/utils');
class FactcheckModel extends MongoBase {
    /**
     * Creates a new FactcheckModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'factcheck');
        this.logger = logger;
    }

    getQueryObject(clientId, slug, id) {
        const queryObj = {};
        if (clientId) {
            queryObj.client_id = clientId;
        }

        if (slug) {
            queryObj.slug = slug;
        }

        if (id) {
            if(Array.isArray(id)){
                queryObj._id = { $in: [] };
                for (let element of id) {
                    queryObj._id.$in.push(new ObjectId(element));
                }
            }
            else{
                queryObj._id = new ObjectId(id);
            }          
        }
        return queryObj;
    }

    // MANDATORY sub documents: claims, status and degaUsers
    // OPTIONAL: All other sub docs are optional
    // eslint-disable-next-line no-unused-vars
    getFactcheck(config, clientId, id, slug, tagSlug, categorySlug, claimantSlug, userSlug, statusSlug, sortBy, sortAsc, limit, next, previous) {

        // get query object
        const queryObj = this.getQueryObject(clientId, slug, id);
        const database = config.get('databaseConfig:databases:factcheck');
        const coreDatabase = config.get('databaseConfig:databases:core');
        const pagingObj = utils.getPagingObject(queryObj, sortBy, sortAsc, limit, next, previous);
        let pagingNew = {};
        return Q(MongoPaging.find(this.collection(database),pagingObj))
            .then((result) => {
                this.logger.info('Converting degaUsers to authors');
                const facts = result.results.map((f) => {
                    f.authors = f.degaUsers;
                    delete f.degaUsers;
                    return f;
                });
                pagingNew.next = result.next;
                pagingNew.hasNext = result.hasNext;
                pagingNew.previous = result.previous;
                pagingNew.hasPrevious = result.hasPrevious;
                const workers = [];
                this.logger.info('Expanding sub-documents');
                facts.forEach((fact) => {
                    const claimsWorkers = [];
                    (fact.claims || []).forEach((claim) => {
                        claimsWorkers.push(Q(this.collection(database, claim.namespace).findOne({ _id: claim.oid })));
                    });
                    const promiseChain = Q.all(claimsWorkers)
                        .then((claims) => {
                            if (!claims || claims.length === 0) {
                                throw Error('SkipFactCheck claims not found');
                            }
                            const claimPromises = claims.map((claim) => {
                                // TODO: single promise fails to retrieve, fix it later
                                const workers = [];
                                if (claim.rating) {
                                    workers.push(Q(this.collection(database, claim.rating.namespace)
                                        .findOne({ _id: claim.rating.oid })));
                                }
                                return Q.all(workers).then((rating) => {
                                    if (rating && rating.length > 0) {
                                        claim.rating = rating[0];
                                    }

                                    if (!claim.claimant) {
                                        return Q();
                                    }

                                    const claimant = claim.claimant;
                                    return Q(this.collection(database, claimant.namespace)
                                        .findOne({ _id: claimant.oid }));
                                }).then((claimant) => {
                                    claim.claimant = claimant;
                                    return claim;
                                });
                            });

                            return Q.all(claimPromises);
                        }).then((claims) => {
                            const claimantSlugs = ((claims || []).filter(c => c.claimant) || [])
                                .map(c => (c.claimant) ? c.claimant.slug : '');
                            const isClaimantFound = claimantSlugs.includes(claimantSlug);
                            if (claimantSlug && !isClaimantFound) {
                                throw Error('SkipFactCheck claim slug not found');
                            }
                            fact.claims = claims;

                            // get all tags
                            const tagPromises = (fact.tags || []).map((t) =>
                                Q(this.collection(coreDatabase, t.namespace).findOne({ _id: t.oid })));
                            return Q.all(tagPromises);
                        }).
                        then((tags) => {
                            const tagSlugs = (tags || []).map(t => (t) ? t.slug : '');
                            const isTagFound = tagSlugs.includes(tagSlug);
                            if (tagSlug && !isTagFound) {
                                throw Error('SkipFactCheck tag slug not found');
                            }
                            fact.tags = tags;

                            // get all categories
                            const categoriesPromises = (fact.categories || []).map((c) =>
                                Q(this.collection(coreDatabase, c.namespace).findOne({ _id: c.oid })));
                            return Q.all(categoriesPromises);
                        }).
                        then((categories) => {
                            const categorySlugs = categories.map(c => (c) ? c.slug : '');
                            const isCategoryFound = categorySlugs.includes(categorySlug);
                            if (categorySlug && !isCategoryFound) {
                                throw Error('SkipFactCheck category slug not found');
                            }
                            fact.categories = categories;

                            // get all dega users
                            if (fact.status) {
                                const status = fact.status;
                                return Q(this.collection(coreDatabase, status.namespace).findOne({ _id: status.oid }));
                            }
                            return Q();
                        }).
                        then((status) => {
                            if (!status || status.name !== 'Publish') {
                                throw Error('SkipFactCheck not published');
                            }
                            fact.status = status;

                            // get all dega users
                            const degaUserPromises = (fact.authors || []).map((u) =>
                                Q(this.collection(coreDatabase, u.namespace).findOne({ _id: u.oid })));
                            return Q.all(degaUserPromises);
                        }).
                        then((authors) => {
                            if (!authors || authors.length === 0) {
                                throw Error('SkipFactCheck users not linked to this factcheck');
                            }
                            const authorSlugs = authors.map(u => (u) ? u.slug : '');
                            const isAuthorFound = authorSlugs.includes(userSlug);
                            if (userSlug && !isAuthorFound) {
                                throw Error('SkipFactCheck user slug not found');
                            }
                            fact.authors = authors;
                            return fact;
                        }).
                        catch((err) => {
                            if (err && err.message.startsWith('SkipFactCheck')) {
                                const msg = err.message.split('SkipFactCheck')[1];
                                this.logger.debug(`Ignoring factcheck ${fact._id} -${msg}`);
                                return null;
                            }
                            this.logger.error(`Errored on factcheck ${fact._id}`);
                            throw err;
                        });
                    workers.push(promiseChain);
                });
                return Q.all(workers);
            }).then(factchecks => {
                let result ={};
                result['data'] = _.compact(factchecks);
                result['paging'] = pagingNew;
                return result;
  
            });
    }
}

module.exports = FactcheckModel;
