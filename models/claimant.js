const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const MongoPaging = require('mongo-cursor-pagination');
const utils = require('../lib/utils');
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
            {
                $project: {
                    id: "$_id",
                    _id: 0,
                    class: "$_class",
                    name: 1,
                    tagLine: '$tag_line',
                    description: 1,
                    slug: 1,
                    clientId: "$client_id",
                    media: 1,
                    createdDate: "$created_date",
                    lastUpdatedDate: "$last_updated_date"
                }
            },
            match
        ]

        const pagingObj = utils.getPagingObject(aggregations, sortBy, sortAsc, limit, next, previous, true);
        const database = config.get('databaseConfig:databases:factcheck');
        return Q(MongoPaging.find(this.collection(database), pagingObj))
            .then((claimants) => {
                const mediaAggregation = utils.mediaPipeline;

                let mediaIds = claimants.results.filter(claimant => claimant.media).map(claimant => claimant.media.oid)
                
                const match = {
                    $match: {
                        id : { $in : mediaIds }
                    }
                };

                mediaAggregation.push(match);
                
                return Q(this.collection(config.get('databaseConfig:databases:core'), 'media')
                    .aggregate(mediaAggregation).toArray())
                    .then((media) => {
                        const mediaObject = media.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {})
                        
                        const claimantsWithMedia =  claimants.results.map( rating => rating.media ? { ...rating, media: mediaObject[rating.media.oid]} : rating )
                        return { ...claimants, results: claimantsWithMedia }
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
}

module.exports = ClaimantModel;
