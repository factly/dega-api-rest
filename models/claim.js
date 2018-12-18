
const MongoBase = require('../lib/MongoBase');
const Q = require('q');

class ClaimModel extends MongoBase {
    /**
     * Creates a new ClaimModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger, errorCode) {
        super(logger, 'claim');
    }

    getClaim(config, clientId) {
        const query = {};

        if (clientId) {
            query.client_id = clientId;
        }

        return Q(this.collection(config.get('databaseConfig:databases:core')).find(query).toArray())
            .then((results) => {
                this.logger.info('Retrieved the results');
                return results;
            });
    }
}

module.exports = ClaimModel;
