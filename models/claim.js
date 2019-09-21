const MongoPaging = require('mongo-cursor-pagination');
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const utils = require('../lib/utils');

const addFields = {
    $addFields: {
        rating: { $arrayElemAt: [{ $objectToArray: '$rating' }, 1] },
        claimant: { $arrayElemAt: [{ $objectToArray: '$claimant' }, 1] }
    }
};

const ratingLookup = {
    $lookup: {
        from: 'rating',
        let: { rating: '$rating' }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
        pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$rating'] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
            {
                $project: {
                    id: '$_id',
                    _id: 0,
                    class: '$_class',
                    name: 1,
                    numericValue: '$numeric_value',
                    isDefault: '$is_default',
                    slug: 1,
                    clientId: '$client_id',
                    description: 1,
                    media: 1,
                    createdDate: '$created_date',
                    lastUpdatedDate: '$last_updated_date'
                }
            },
        ],
        as: 'rating'
    }
};

const claimantLookup = {
    $lookup: {
        from: 'claimant',
        let: { claimant: '$claimant' }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
        pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$claimant'] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
            {
                $project: {
                    id: '$_id',
                    _id: 0,
                    class: '$_class',
                    name: 1,
                    tagLine: '$tag_line',
                    slug: 1,
                    clientId: '$client_id',
                    description: 1,
                    createdDate: '$created_date',
                    lastUpdatedDate: '$last_updated_date'
                }
            },
        ],
        as: 'claimant'
    }
};

const project = {
    $project: {
        id: '$_id',
        _id: 0,
        class: '$_class',
        claim: 1,
        slug: 1,
        clientId: '$client_id',
        title: 1,
        description: 1,
        rating: 1,
        claimant: 1,
        claimDate: '$claim_date',
        claimSource: '$claim_source',
        checkedDate: '$checked_date',
        reviewSources: '$review_sources',
        review: '$review',
        reviewTagLine: '$review_tag_line',
        createdDate: '$created_date',
        lastUpdatedDate: '$last_updated_date'
    }
};


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
        
        const queryObj = this.getQueryObject(clientId, ratingSlug, claimantSlug);
        const match = { $match: queryObj };

        const aggregations = [
            addFields,
            {
                $addFields: { rating: '$rating.v', claimant: '$claimant.v' }
            },
            ratingLookup,
            { $unwind: { path: '$rating', preserveNullAndEmptyArrays: true } },
            claimantLookup,
            { $unwind: { path: '$claimant', preserveNullAndEmptyArrays: true } },
            project,
            match,
        ];

        this.logger.info(`Query Object ${JSON.stringify(queryObj)}`);

        const pagingObj = utils.getPagingObject(aggregations, sortBy, sortAsc, limit, next, previous, true);
        const database = config.get('databaseConfig:databases:factcheck');
        const pagingNew = {};

        return Q(MongoPaging.aggregate(this.collection(database), pagingObj))
            .then((aggResult) => {
                const results = aggResult.results;
                this.logger.info('Retrieved the claims');
                const claims = {};
                pagingNew.next = aggResult.next;
                pagingNew.hasNext = aggResult.hasNext;
                pagingNew.previous = aggResult.previous;
                pagingNew.hasPrevious = aggResult.hasPrevious;
                claims.data = results;
                claims.paging = pagingNew;
                return claims;
            });
    }
    getQueryObject(clientId, ratingSlug, claimantSlug) {
        const queryObj = {};

        if (clientId) {
            queryObj.client_id = clientId;
        }

        if (ratingSlug) {
            queryObj.rating = {
                $elemMatch: {slug: ratingSlug}
            };
        }

        if (claimantSlug) {
            queryObj.claimant = {
                $elemMatch: {slug: claimantSlug}
            };
        }

        return queryObj;
    }
}

module.exports = ClaimModel;
