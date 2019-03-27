const MongoBase = require('../lib/MongoBase');
const Q = require('q');

class RoleModel extends MongoBase {
    /**
     * Creates a new RoleModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'role');
        this.logger = logger;
    }

    getRole(config, clientId, slug) {
        const query = {};

        if (clientId) {
            query.client_id = clientId;
        }
        if (slug) {
            query.slug = slug;
        }

        const database = config.get('databaseConfig:databases:core');
        return Q(this.collection(database).find(query).toArray())
            .then((results) => {
                this.logger.info('Retrieved the results');
                return results;
            });
    }
}

module.exports = RoleModel;
