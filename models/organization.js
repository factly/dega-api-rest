const MongoBase = require('../lib/MongoBase');
const Q = require('q');

class OrganizationModel extends MongoBase {
    /**
     * Creates a new OrganizationModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'organization');
        this.logger = logger;
    }

    getOrganization(config, clientId) {
        const query = {};

        if (clientId) {
            query.client_id = clientId;
        }

        return Q(this.collection(config.get('databaseConfig:databases:core'))
            .find(query).toArray())
            .then((results) => {
                this.logger.info('Retrieved the results');
                return results;
            });
    }
}

module.exports = OrganizationModel;
