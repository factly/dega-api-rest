
const MongoBase = require('../lib/MongoBase');
const Q = require('q');

class RatingModel extends MongoBase {
    /**
     * Creates a new RatingModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger, errorCode) {
        super(logger, 'rating');
    }

    getRating(config, clientId) {
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

module.exports = RatingModel;
