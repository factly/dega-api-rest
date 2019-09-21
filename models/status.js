const MongoBase = require('../lib/MongoBase');
const Q = require('q');
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
                    isDefault: '$is_default',
                    clientId: '$client_id',
                    createdDate: '$created_date',
                    lastUpdatedDate: '$last_updated_date'
                }
            },
            match,
        ];

        const database = config.get('databaseConfig:databases:core');
        return Q(this.collection(database)
            .aggregate(aggregations).toArray())
            .then((results) => {
                this.logger.info('Retrieved the results');
                return results;
            });
    }
}

module.exports = StatusModel;
