
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
        const pagingObj = utils.getPagingObject(query, sortBy, sortAsc, limit, next, previous);
        const database = config.get('databaseConfig:databases:factcheck');
        return Q(MongoPaging.find(this.collection(database),pagingObj))
            .then((result) => {
                this.logger.info('Retrieved the results');
                result['data'] = result.results;
                let response = {};
                response['data'] = result.results;
                response['paging'] = {};
                response['paging']['next'] = result.next;
                response['paging']['hasNext'] = result.hasNext;
                response['paging']['previous'] = result.previous;
                response['paging']['hasPrevious'] = result.hasPrevious;
                return response;
            });
    }
}

module.exports = RatingModel;
