const MongoBase = require('../lib/MongoBase');
const Q = require('q');
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

    getFormat(config, clientId, slug) {
        // get query object
        const query = this.getQueryObject(clientId, slug);

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
                return {
                    data: results
                };
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

module.exports = FormatModel;
