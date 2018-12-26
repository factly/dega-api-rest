
const mongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
const Q = require('q');

class Database {
    constructor() {
        this.client = null;
    }

    getDb(name) {
        if (!name) {
            name = this.database;
        }
        return this.client.db(name);
    }

    config(dbConfig, logger) {
        const options = this.createConnectionInformation(dbConfig, true);

        // TODO: Decide on whether to use promise or callback after testing!!!
        return Q(mongoClient.connect(options.uri, options.options))
            .then((ret, err) => {
                if (err) {
                    const tokens = {};
                    logger.setException(err, tokens);
                    logger.error('Error connecting to MongoDB', null, tokens);
                }
                this.client = ret;
            })
            .catch((err) => {
                if (err) {
                    const tokens = {};
                    logger.setException(err, tokens);
                    logger.error('Error connecting to MongoDB', null, tokens);
                }
            });
    }

    serverStatus() {
        return Q(this.getDb().executeDbAdminCommand({ serverStatus: 1 }));
    }

    disconnect() {
        return Q(this.client.close());
    }

    init(dbConfig) {
        return this.config(dbConfig);
    }

    createConnectionInformation(dbConfig, addAuthToUrl) {
        const options = {
            poolSize: dbConfig.poolSize || 5,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
            authSource: dbConfig.authDb || dbConfig.database,
        };

        if (dbConfig.username) {
            options.user = dbConfig.username;
        }
        if (dbConfig.passwd) {
            options.pass = dbConfig.passwd;
        }
        if (dbConfig.database) {
            this.database = dbConfig.database;
        }

        // Build out comma separated list of servers
        let servers = '';
        _.forEach(dbConfig.hosts, (host) => {
            if (servers.length > 0) {
                servers = `${servers},`;
            }
            servers += host;
        });

        // Encoded authentication info
        let auth = '';
        if (addAuthToUrl && options.user && options.pass) {
            options.uri_decode_auth = true;
            auth = `${encodeURIComponent(options.user)}:${encodeURIComponent(options.pass)}@`;
        }

        // Replica set information and options
        let replicaSet = '';
        if (dbConfig.replicaSetName) {
            options.replicaSet = dbConfig.replicaSetName;
            options.readPreference = 'ReadPreference.PRIMARY_PREFERRED';
            replicaSet = `?replicaSet=${dbConfig.replicaSetName}`;
        }

        // Put it all together into a URL
        const uri = `mongodb://${auth}${servers}/${dbConfig.database}${replicaSet}`;

        return { uri, options };
    }
}

const db = new Database();

module.exports = db;
