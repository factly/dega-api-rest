
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
            query.client_id = clientId;
        }
        const response = {};
        const pagingObj = utils.getPagingObject(query, sortBy, sortAsc, limit, next, previous);
        const database = config.get('databaseConfig:databases:factcheck');
        const coreDatabase = config.get('databaseConfig:databases:core');
        return Q(MongoPaging.find(this.collection(database), pagingObj))
            .then((result) => {
                this.logger.info('Retrieved the results');
                // response.data = result.results;
                response.paging = {};
                response.paging.next = result.next;
                response.paging.hasNext = result.hasNext;
                response.paging.previous = result.previous;
                response.paging.hasPrevious = result.hasPrevious;

                const promiseArr = result.results.map((rating) => {
                    if (rating && rating.media) {
                        const mediaAggregation = utils.mediaPipeline;
                        // build match object using media GUID and attach it to pipeline
                        const match = {
                            $match: {
                                id : rating.media.oid
                            }
                        };
                        mediaAggregation.push(match);
                        const pagingObj = utils.getPagingObject(mediaAggregation,
                            null, null, null, null, null, true);
                        return Q(MongoPaging.aggregate(this.collection(coreDatabase, rating.media.namespace), pagingObj))
                            .then((media) => {
                                // aggregation result will always be array
                                if(media.results && media.results.length === 1){
                                    rating.media = media.results[0];
                                }
                                // rating.media = media;
                                return rating;
                            });
                    }
                    return Q(rating);
                });

                return Q.all(promiseArr);
            })
            .then((ratings) => {
                response.data = ratings;
                return response;
            });
    }
}

module.exports = RatingModel;
