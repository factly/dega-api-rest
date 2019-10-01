const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const MongoPaging = require('mongo-cursor-pagination');
const utils = require('../lib/utils');
const ObjectId = require('mongodb').ObjectID;

const claimantProject = {
    $project: {
        id: '$_id',
        _id: 0,
        class: '$_class',
        name: 1,
        tagLine: '$tag_line',
        description: 1,
        slug: 1,
        clientId: '$client_id',
        media: 1,
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

class ClaimantModel extends MongoBase {
    /**
     * Creates a new ClaimantModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'claimant');
        this.logger = logger;
    }

    getClaimant(config, clientId, sortBy, sortAsc, limit, next, previous) {
        const query = {};

        if (clientId) {
            query.client_id = clientId;
        }
        const match = { $match: query };

        const aggregations = [
            match,
            claimantProject,
        ];

        const pagingObj = utils.getPagingObject(aggregations, sortBy, sortAsc, limit, next, previous, true);
        const database = config.get('databaseConfig:databases:factcheck');
        return Q(MongoPaging.find(this.collection(database), pagingObj))
            .then((claimants) => {
                let mediaIds = claimants.results.filter(claimant => claimant.media).map(claimant => claimant.media.oid);
                
                const query = {
                    _id : { $in : mediaIds }
                };

                const mediaAggregation = [
                    {
                        $match: query
                    },
                    mediaProject,
                ];
                
                return Q(this.collection(config.get('databaseConfig:databases:core'), 'media')
                    .aggregate(mediaAggregation).toArray())
                    .then((media) => {
                        const mediaObject = media.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
                        const claimantMedia =  claimants.results.map( rating => rating.media ? { ...rating, media: mediaObject[rating.media.oid]} : rating );
                        return { ...claimants, results: claimantMedia };
                    });
            })
            .then((result) => {
                this.logger.info('Retrieved the results');
                const response = {};
                response.data = result.results;
                response.paging = {};
                response.paging.next = result.next;
                response.paging.hasNext = result.hasNext;
                response.paging.previous = result.previous;
                response.paging.hasPrevious = result.hasPrevious;
                return response;
            });
    }

    getClaimantByParam(config, clientId, param) {
        const query = {};

        if(ObjectId.isValid(param)){
            query._id = new ObjectId(param);
        } else {
            query.slug= param;
        }

        if (clientId) {
            query.client_id = clientId;
        }

        const match = { $match: query };

        const aggregations = [
            match,
            claimantProject,
        ];

        const database = config.get('databaseConfig:databases:factcheck');
        return Q(this.collection(database, 'claimant')
            .aggregate(aggregations).toArray())
            .then((claimant) => {

                if(claimant.length !== 1) return;

                claimant = claimant[0];
                
                if(!claimant.media) return { data: claimant };
                
                const mediaQuery = { _id : claimant.media.oid };

                const mediaAggregation = [
                    {
                        $match: mediaQuery
                    },
                    mediaProject,
                ];
                
                return Q(this.collection(config.get('databaseConfig:databases:core'), 'media')
                    .aggregate(mediaAggregation).toArray())
                    .then((media) => {
                        return {
                            data: { ...claimant, media: media[0]}
                        };
                    });
            });
    }
}

module.exports = ClaimantModel;
