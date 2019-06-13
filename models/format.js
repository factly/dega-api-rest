const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const MongoPaging = require('mongo-cursor-pagination');

class FormatModel extends MongoBase {
    /**
     * Creates a new FormatModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'format');
        this.logger = logger;
    }

    getFormat(config, clientId, slug, sortBy, sortAsc, limit, next, previous) {
        // get query object
        const query = this.getQueryObject(clientId, slug);
        if (clientId) {
            query.client_id = clientId;
        }
        const pagingObj = this.getPagingObject(query, sortBy, sortAsc, limit, next, previous);
        const database = config.get('databaseConfig:databases:core');
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

    getQueryObject(clientId, slug) {
        const queryObj = {};
        if (clientId) {
            queryObj.client_id = clientId;
        }

        if (slug) {
            queryObj.slug = slug;
        }
        return queryObj;
    }
    getPagingObject(queryObj, sortBy, sortAsc, limit, next, previous) {
        const pagingObj = {};
        pagingObj.query = queryObj;
        pagingObj.limit = (limit) ? parseInt(limit) : 20;

        if (sortBy) {
            pagingObj.paginatedField = sortBy;
        }

        if (sortAsc) {
            pagingObj.sortAscending = (sortAsc === 'true');
        }

        if (next) {
            pagingObj.next = next;
        }

        if (previous) {
            pagingObj.previous = previous;
        }
        return pagingObj;
    }
}

module.exports = FormatModel;
