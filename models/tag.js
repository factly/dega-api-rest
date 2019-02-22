const mongoClient = require('mongodb').MongoClient;
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const logger = require('logger').createLogger();

class TagModel extends MongoBase {
    /**
     * Creates a new TagModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'tag');
    }

    getTag(config, clientId) {
        const query = {};

        if (clientId) {
            query.client_id = clientId;
        }

        // return Q(this.collection(config.get('databaseConfig:databases:core')).find(query).toArray())
        //     .then((results) => {
        //         this.logger.info('Retrieved the results');
        //         return results;
        //     });
        return Q(mongoClient.connect('mongodb://mongodb:27017/'))
            .then((ret, err) => {
                if (err) {
                    const msg = (err) ? err.stack : err;
                    logger.error(`Error connecting to MongoDB: ${msg}`);
                }
                console.log(ret);
                return ret;
            })
            .then((client) => {
                return Q(client.db(config.get('databaseConfig:databases:core')));
            })
            .then((database) => {
                return Q(database.collection(this.collectionName));
            })
            .then((collection) => {
                return Q(collection.find(query).toArray());
            })
            .then((results) => {
                this.logger.info('Retrieved the results');
                return results;
            });

    }
}

module.exports = TagModel;
