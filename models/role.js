const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const MongoPaging = require('mongo-cursor-pagination');
const utils = require('../lib/utils');
class RoleModel extends MongoBase {
    /**
     * Creates a new RoleModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'role');
        this.logger = logger;
    }

    getRole(config, clientId, slug, sortBy, sortAsc, limit, next, previous) {
        
        const query = this.getQueryObject(clientId, slug);

        const match = { $match: query };

        const aggregations = [
            {
                $project : {
                    id: "$_id",
                    _id: 0,
                    class: "$_class",
                    name: 1,
                    isDefault: "$is_default",
                    slug: 1,
                    clientId: "$client_id",
                    keyclockId: "$keycloak_id",
                    keyclockName: "$keycloak_name",
                    createdDate: "$created_date",
                    lastUpdatedDate: "$last_updated_date"
                }
            },
            match
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
    getQueryObject(clientId, slug) {
        const queryObj = {};
        if (clientId) {
            queryObj.clientId = clientId;
        }

        if (slug) {
            queryObj.slug = slug;
        }
        return queryObj;
    }
}

module.exports = RoleModel;
