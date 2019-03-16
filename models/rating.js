const MongoBase = require('../lib/MongoBase');
const Q = require('q');

class RatingModel extends MongoBase {
    /**
     * Creates a new RatingModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'rating');
        this.logger = logger;
    }

    getRating(config, clientId) {
        const query = {};

        if (clientId) {
            query.client_id = clientId;
        }

        return Q(this.collection(config.get('databaseConfig:databases:factcheck')).find(query).toArray())
            .then((results) => {
                this.logger.info('Retrieved the results');
                return results;
            });
    }
}

module.exports = RatingModel;
