const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const MongoPaging = require('mongo-cursor-pagination');
const utils = require('../lib/utils');

class CategoryModel extends MongoBase {
    /**
     * Creates a new CategoryModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'category');
        this.logger = logger;
    }

    getCategory(config, clientId, sortBy, sortAsc, limit, next, previous) {
        const query = {};

        if (clientId) {
            query.client_id = clientId;
        }
        const pagingObj = utils.getPagingObject(query, sortBy, sortAsc, limit, next, previous);
        const database = config.get('databaseConfig:databases:core');
        return Q(MongoPaging.find(this.collection(database), pagingObj))
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

module.exports = CategoryModel;
