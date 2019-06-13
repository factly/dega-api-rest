const MongoPaging = require('mongo-cursor-pagination');
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const _ = require('lodash');
const utils = require('../lib/utils');
class ClaimModel extends MongoBase {
    /**
     * Creates a new ClaimModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'claim');
        this.logger = logger;
    }

    getClaim(config, clientId, ratingSlug, claimantSlug, sortBy, sortAsc, limit, next, previous) {
        const query = {};

        if (clientId) {
            query.client_id = clientId;
        }
        const database = config.get('databaseConfig:databases:factcheck');
        const pagingObj = utils.getPagingObject(query, sortBy, sortAsc, limit, next, previous);
        let pagingNew = {};
        return Q(MongoPaging.find(this.collection(database),pagingObj))
            .then((result) => {
                this.logger.info('Retrieved the results');
                pagingNew.next = result.next;
                pagingNew.hasNext = result.hasNext;
                pagingNew.previous = result.previous;
                pagingNew.hasPrevious = result.hasPrevious;
                const claimsPromises = result.results.map((claim) => {
                    // TODO: single promise fails to retrieve, fix it later
                    const workers = [];
                    if(claim.rating) {
                        workers.push(
                            Q(this.collection(database, claim.rating.namespace).findOne({_id: claim.rating.oid})));
                    }
                    return Q.all(workers).then((rating) => {
                        if (rating && rating.length > 0) {
                            claim.rating = rating[0];
                        }

                        if (ratingSlug && !(claim.rating.slug === ratingSlug)) {
                            throw Error('SkipClaim');
                        }

                        if(!claim.claimant) {
                            return Q();
                        }

                        const claimant = claim.claimant;
                        return Q(this.collection(database, claimant.namespace).findOne({_id: claimant.oid}));
                    }).then((claimant) => {
                        if (claimantSlug && !(claimant.slug === claimantSlug)) {
                            throw Error('SkipClaim');
                        }
                        claim.claimant = claimant;
                        return claim;
                    }).catch((err) => {
                        if (err && err.message === 'SkipClaim') {
                            const msg = err.message.split('SkipClaim')[1];
                            this.logger.debug(`Ignoring claim -${msg}`);
                            return null;
                        }
                        throw err;
                    });
                });
                return Q.all(claimsPromises);
            }).then(claims =>{
                let result ={};
                result['data'] = _.compact(claims);
                result['paging'] = pagingNew;
                return result;
                
            });
    }
}

module.exports = ClaimModel;
