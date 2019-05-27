
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
        if (clientId) {
            query.client_id = clientId;
        }

        return Q(this.collection(config.get('databaseConfig:databases:core')).find(query).toArray())
            .then((results) => {
                this.logger.info('Retrieved the results');
                return results;
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
}

module.exports = FormatModel;
