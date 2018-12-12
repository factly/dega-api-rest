
const MongoBase = require('../lib/MongoBase');
const Q = require('q');

class UserModel extends MongoBase {
    /**
     * Creates a new UserModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger, errorCode) {
        super(logger, 'dega_user');
    }

    getUser(clientId) {
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

module.exports = UserModel;
