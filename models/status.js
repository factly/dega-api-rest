const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const ObjectId = require('mongodb').ObjectID;

const statusProject = {
    $project : {
        id: '$_id',
        _id: 0,
        class: '$_class',
        name: 1,
        slug: 1,
        isDefault: '$is_default',
        clientId: '$client_id',
        createdDate: '$created_date',
        lastUpdatedDate: '$last_updated_date'
    }
};

class StatusModel extends MongoBase {
    /**
     * Creates a new StatusModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'status');
        this.logger = logger;
    }

    getStatus(config, clientId) {
        const query = {
            client_id: {
                $in: [clientId, 'default']
            }
        };

        const match = { $match: query };

        const aggregations = [
            match,
            statusProject,
        ];

        const database = config.get('databaseConfig:databases:core');
        return Q(this.collection(database)
            .aggregate(aggregations).toArray())
            .then((results) => {
                this.logger.info('Retrieved the results');
                return {
                    data: results
                };
            });
    }

    getStatusByKey(config, clientId, key){
        const query = {
            client_id: {
                $in: [clientId, 'default']
            }
        };        

        if(ObjectId.isValid(key)){
            query._id = new ObjectId(key);
        } else {
            query.slug= key;
        }

        const match = { $match: query };

        const aggregations = [
            match,
            statusProject,
        ];

        const database = config.get('databaseConfig:databases:core');
        return Q(this.collection(database)
            .aggregate(aggregations).toArray())
            .then((results) => {
                if(results.length !== 1) return;
                this.logger.info('Retrieved the results');
                return {
                    data: results[0]
                };
            });
    }
}

module.exports = StatusModel;
