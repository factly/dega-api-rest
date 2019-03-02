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
        // pull the uri from environment variable
        const envMongoDbUri = process.env.MONGODB_URI;

        // URI from env variable takes the preference over pulling it from config file
        const mongoDbUri = (envMongoDbUri) ? envMongoDbUri : dbConfig.uri;

        logger.info(`Connecting to mongo uri ${mongoDbUri}`);
        return utils.retry(5, 10000, (() => this.getConnection(mongoDbUri)), logger);
    }

    getConnection(uri, logger) {
        // return Q(mongoClient.connect(options.uri, options.options))
        return Q(mongoClient.connect(uri))
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
}

const db = new Database();

module.exports = db;
