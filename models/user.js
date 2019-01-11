
const MongoBase = require('../lib/MongoBase');
const Q = require('q');

class UserModel extends MongoBase {
    /**
     * Creates a new UserModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'dega_user');
    }

    getUser(config, clientId) {
        const query = {};

        if (clientId) {
            query.client_id = clientId;
        }

        // get database from env config
        const database = config.get('databaseConfig:databases:core');

        // get all users
        return Q(this.collection(database).find(query).toArray())
            .then((users) => {
                this.logger.info('Retrieved the results');

                const workers = [];
                users.forEach((user) => {
                    const promise = Q();

                    if (user.role) {
                        const roleID = user.role.oid;
                        const collection = user.role.namespace;
                        promise.then(() => Q(this.collection(database, collection).findOne({_id: roleID})));
                    }
                    const promiseChain = promise
                        .then((role) => {
                            user.role = role;
                            if (!user.organizationCurrent) {
                                return Q();
                            }

                            // query org current
                            const collection = user.organizationCurrent.namespace;
                            const orgID = user.organizationCurrent.oid;
                            return Q(this.collection(database, collection).findOne({_id: orgID}));
                        }).then((org) => {
                            user.organizationCurrent = org;
                            if (!user.organizationDefault) {
                                return Q();
                            }

                            // query org default
                            const collection = user.organizationDefault.namespace;
                            const orgID = user.organizationDefault.oid;
                            return Q(this.collection(database, collection).findOne({_id: orgID}));
                        }).then((org) => {
                            user.organizationDefault = org;
                            if (!user.organizations) {
                                return Q();
                            }

                            // query all orgs
                            const orgs = user.organizations;
                            const workers = [];
                            orgs.forEach((org) => {
                                workers.push(Q(this.collection(database, org.namespace).findOne({_id: org.oid})));
                            });
                            return Q.all(workers);
                        }).then((orgs) => {
                            user.organizations = orgs;
                            return user;
                        });
                    workers.push(promiseChain);
                });
                // return users;
                return Q.all(workers);
            });
    }
}

module.exports = UserModel;
