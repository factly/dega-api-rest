
const MongoBase = require('../lib/MongoBase');
const utils = require('../lib/utils');
const Utils = new utils();
const Q = require('q');

class OrganizationModel extends MongoBase {
    /**
     * Creates a new OrganizationModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger, errorCode) {
        const dbName = Utils.getDatabaseName('core');
        super(logger, 'organization', dbName);
    }

    getOrganization(clientId) {
        const query = {};

        if (clientId) {
            query.client_id = clientId;
        }

        return Q(this.collection().find(query).toArray())
            .then((results) => {
                this.logger.info('Retrieved the results');
                return results;
            });
    }
}

module.exports = OrganizationModel;
