const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const MongoPaging = require('mongo-cursor-pagination');
const utils = require('../lib/utils');
const ObjectId = require('mongodb').ObjectID;

const categoryProject = {
    $project : {
        id: '$_id',
        _id: 0,
        class: '$_class',
        name: 1,
        description: 1,
        slug: 1,
        parent: 1,
        clientId: '$client_id',
        createdDate: '$created_date',
        lastUpdatedDate: '$last_updated_date'
    }
};

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

        const match = { $match: query };

        const aggregations = [
            match,
            categoryProject,
        ];

        const pagingObj = utils.getPagingObject(aggregations, sortBy, sortAsc, limit, next, previous, true);
        const database = config.get('databaseConfig:databases:core');
        return Q(MongoPaging.aggregate(this.collection(database), pagingObj))
            .then((result) => {
                this.logger.info('Retrieved the results');
                const response = {};
                response.data = result.results;
                response.paging = { ...result, results: undefined};
                return response;
            });
    }

    getCategoryByParam(config, clientId, param){
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
            categoryProject,
        ];

        const database = config.get('databaseConfig:databases:core');
        return Q(this.collection(database)
            .aggregate(aggregations).toArray())
            .then((result) => {
                this.logger.info('Retrieved the results');
                if(result && result.length === 1)
                    return {
                        data: result[0]
                    };

                return;
            });
    }
}

module.exports = CategoryModel;
