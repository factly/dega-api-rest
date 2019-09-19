
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const MongoPaging = require('mongo-cursor-pagination');
const utils = require('../lib/utils');

class RatingModel extends MongoBase {
    /**
     * Creates a new RatingModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'rating');
        this.logger = logger;
    }

    getRating(config, clientId, sortBy, sortAsc, limit, next, previous) {
        const query = {};

        if (clientId) {
            query.clientId = clientId;
        }

        const match = { $match: query };

        const aggregations = [
            {
                $project: {
                    id: "$_id",
                    _id: 0,
                    class: "$_class",
                    name: 1,
                    numericValue: "$numeric_value",
                    isDefault: "$is_default",
                    slug: 1,
                    clientId: "$client_id",
                    description: 1,
                    media: 1,
                    createdDate: "$created_date",
                    lastUpdatedDate: "$last_updated_date"
                }
            },
            match
        ]

        return Q(this.collection(config.get('databaseConfig:databases:factcheck'))
            .aggregate(aggregations).toArray())
            .then((ratings) => {
                const mediaAggregation = utils.mediaPipeline;

                let mediaIds = ratings.filter(rating => rating.media).map( rating => rating.media.oid )
                
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
                        
                        return ratings.map( rating => rating.media ? { ...rating, media: mediaObject[rating.media.oid]} : rating )
                    });
            })
            .then((results) => {
                this.logger.info('Retrieved the results');
                return results;
            });
    }
}

module.exports = RatingModel;
