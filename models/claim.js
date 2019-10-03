const MongoPaging = require('mongo-cursor-pagination');
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const utils = require('../lib/utils');
const ObjectId = require('mongodb').ObjectID;

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
                    media: 1,
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

const mediaProject = {
    $project: {
        id: '$_id',
        _id: 0,
        class:'$_class',
        name: 1,
        type: 1,
        url: 1,
        fileSize: '$file_size',
        dimensions: 1,
        title: 1,
        caption: 1,
        altText: '$alt_text',
        description: 1,
        uploadedBy: '$uploaded_by',
        publishedDate: '$published_date',
        lastUpdatedDate: '$last_updated_date',
        slug: 1,
        clientId: '$client_id',
        createdDate: '$created_date',
        relativeURL: '$relative_url',
        sourceURL: '$source_url'
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
        const factcheckDatabase = config.get('databaseConfig:databases:factcheck');
        const coreDatabase = config.get('databaseConfig:databases:core');
        const pagingNew = {};

        return Q(MongoPaging.aggregate(this.collection(factcheckDatabase), pagingObj))
            .then((aggResult) => {
                this.logger.info('Retrieved the claims');
                pagingNew.next = aggResult.next;
                pagingNew.hasNext = aggResult.hasNext;
                pagingNew.previous = aggResult.previous;
                pagingNew.hasPrevious = aggResult.hasPrevious;
                
                return aggResult.results;
            })
            .then( claims => {
                let allMediaIds = [];  

                allMediaIds = claims.filter(claim => claim.rating.media).map( claim => claim.rating.media.oid );
                allMediaIds = allMediaIds.concat(claims.filter(claim => claim.claimant.media).map( claim => claim.claimant.media.oid ));
                
                if(allMediaIds.length === 0) return claims;
                
                const match = {
                    $match: {
                        _id : { $in : allMediaIds }
                    }
                };

                const mediaAggregation = [
                    match,
                    mediaProject,
                ];

                return Q(this.collection(coreDatabase, 'media')
                    .aggregate(mediaAggregation).toArray())
                    .then((media) => {
                        //Converting "Array of Object" into "Object of Object" where sub object key is sub object mongodb ObjectId which is used in DRref
                        const mediaObject = media.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});

                        //Traveling through all the factchecks and replacing DBref media with full media object
                        return {
                            data: claims.map( claim => claim.rating.media ? { ...claim, rating: { ...claim.rating, media: mediaObject[claim.rating.media.oid]}} : claim )
                                .map( claim => claim.claimant.media ? { ...claim, claimant: { ...claim.claimant, media: mediaObject[claim.claimant.media.oid]}} : claim ),
                            paging: pagingNew
                        };
                    });
            });
    }
    getQueryObject(clientId, ratingSlug, claimantSlug) {
        const queryObj = {
            clientId: clientId
        };

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
    getClaimByKey(config, clientId, key) {
        const query = {
            client_id: clientId
        };

        if(ObjectId.isValid(key)){
            query._id = new ObjectId(key);
        } else {
            query.slug= key;
        }
        
        const match = { $match: query };

        const aggregations = [
            match,
            addFields,
            {
                $addFields: { rating: '$rating.v', claimant: '$claimant.v' }
            },
            ratingLookup,
            { $unwind: { path: '$rating', preserveNullAndEmptyArrays: true } },
            claimantLookup,
            { $unwind: { path: '$claimant', preserveNullAndEmptyArrays: true } },
            project,
        ];

        this.logger.info(`Query Object ${JSON.stringify(query)}`);

        const factcheckDatabase = config.get('databaseConfig:databases:factcheck');
        const coreDatabase = config.get('databaseConfig:databases:core');

        return Q(this.collection(factcheckDatabase)
            .aggregate(aggregations).toArray())
            .then( claims => {
                this.logger.info('Retrieved the claims');

                if(claims.length !== 1) return;
                const claim = claims[0];
                
                if(!claim.rating.media && !claim.claimant.media) return;
                
                let allMediaIds = [];

                if(claim.rating.media) allMediaIds.push(claim.rating.media.oid);
                if(claim.claimant.media) allMediaIds.push(claim.claimant.media.oid);
                
                const match = {
                    $match: {
                        _id : { $in : allMediaIds }
                    }
                };

                const mediaAggregation = [
                    match,
                    mediaProject,
                ];

                return Q(this.collection(coreDatabase, 'media')
                    .aggregate(mediaAggregation).toArray())
                    .then((media) => {  
                        //Converting "Array of Object" into "Object of Object" where sub object key is sub object mongodb ObjectId which is used in DRref
                        const mediaObject = media.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
                        
                        //Traveling through all the factchecks and replacing DBref media with full media object
                        if(claim.rating.media) claim.rating.media = mediaObject[claim.rating.media.oid];
                        if(claim.claimant.media) claim.claimant.media = mediaObject[claim.claimant.media.oid];

                        return { data: claim };
                    });
            });
    }
}

module.exports = ClaimModel;
