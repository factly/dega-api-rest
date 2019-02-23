const mongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
const Q = require('q');
const utils = require('./utils');

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
        return utils.retry(5, 10000, (() => this.getConnection(options)), logger);
    }

    getConnection(options, logger) {
        return Q(mongoClient.connect(options.uri, options.options))
            .then((ret, err) => {
                if (err) {
                    const msg = (err) ? err.stack : err;
                    logger.error(`Error connecting to MongoDB: ${msg}`);
                    throw Error(err);
                }
                this.client = ret;
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
        const envHost = process.env.DATABASE_HOST;
        if (envHost) {
            dbConfig.envHost = envHost;
        }

        const envPort = process.env.DATABASE_PORT;
        if (envPort) {
            dbConfig.envPort = envPort;
        }

        if (dbConfig.username) {
            options.user = dbConfig.username;
        }
        if (dbConfig.passwd) {
            options.pass = dbConfig.passwd;
        }
        if (dbConfig.databases) {
            this.database = dbConfig.databases.core;
        }

        // Build out comma separated list of servers
        let servers = '';
        if(envHost && envPort) {
            servers = `${envHost}:${envPort}`;
        } else {
            // pull from config files
            _.forEach(dbConfig.hosts, (host) => {
                if (servers.length > 0) {
                    servers = `${servers},`;
                }
                servers += host;
            });
        }

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
        const uri = `mongodb://${auth}${servers}/${this.database}${replicaSet}`;

        return { uri, options };
    }
}

const db = new Database();

module.exports = db;
