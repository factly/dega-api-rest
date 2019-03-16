
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
            query.client_id = clientId;
        }

        return Q(this.collection(config.get('databaseConfig:databases:core')).find(query).toArray())
            .then((results) => {
                this.logger.debug('Retrieved the results');
                return results;
            });
    }
}

module.exports = StatusModel;
