
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const _ = require('lodash');

class ClaimModel extends MongoBase {
    /**
     * Creates a new ClaimModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'claim');
    }

    getClaim(config, clientId, ratingSlug, claimantSlug) {
        const query = {};

        if (clientId) {
            query.client_id = clientId;
        }

        const database = config.get('databaseConfig:databases:factcheck');
        return Q(this.collection(database).find(query).toArray())
            .then((claims) => {
                this.logger.info('Retrieved the results');
                const claimsPromises = claims.map((claim) => {
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
                            return null;
                        }
                        throw err;
                    });
                });
                return Q.all(claimsPromises);
            }).then(claims => _.compact(claims));
    }
}

module.exports = ClaimModel;
