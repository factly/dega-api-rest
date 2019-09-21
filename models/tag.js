const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const MongoPaging = require('mongo-cursor-pagination');
const utils = require('../lib/utils');

class TagModel extends MongoBase {
    /**
     * Creates a new TagModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'tag');
        this.logger = logger;
    }

    getTag(config, clientId, sortBy, sortAsc, limit, next, previous) {
        const query = {};
        if (clientId) {
            query.clientId = clientId;
        }

        const match = { $match: query };

        const aggregations = [
            {
                $project : {
                    id: '$_id',
                    _id: 0,
                    class: '$_class',
                    name: 1,
                    slug: 1,
                    description: 1,
                    clientId: '$client_id',
                    createdDate: '$created_date',
                    lastUpdatedDate: '$last_updated_date'
                }
            },
            match,
        ];

        const pagingObj = utils.getPagingObject(aggregations, sortBy, sortAsc, limit, next, previous, true);
        const database = config.get('databaseConfig:databases:core');
        return Q(MongoPaging.aggregate(this.collection(database), pagingObj))
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

module.exports = TagModel;
