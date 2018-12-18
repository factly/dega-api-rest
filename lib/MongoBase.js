/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getGridFS"] }] */
const BaseClass = require('./base');
const database = require('../lib/database');

/**
 * Base class for Models that depend on Mongo.  As models only depend on mongo, they can
 * simply depend on this class
 */
class MongoBase extends BaseClass {
    /**
     * constructor
     * @param {Object} logger - logger
     * @param collectionName
     */
    constructor(logger, collectionName) {
        super(logger);
        this.collectionName = collectionName;
    }

    /**
     *
     * @param collectionName
     * @returns {MongoCollection}
     */
    collection(dbName, collectionName) {
        const db = database.getDb(dbName);
        if (collectionName) {
            return db.collection(collectionName);
        }

        return db.collection(this.collectionName);
    }
}

module.exports = MongoBase;
