
const MongoPaging = require('mongo-cursor-pagination');
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
var logger = require('logger').createLogger();

class PostsModel extends MongoBase {
    /**
     * Creates a new PostsModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'post');
    }

    getPosts(config, clientId, slug, sortBy, sortAsc, limit, next, previous) {
        const queryObj = {};
        const pagingObj = {};
        logger.debug('entered model');

        if (clientId) {
            queryObj.client_id = clientId;
        }

        if (slug) {
            queryObj.slug = slug;
        }

        pagingObj.query = queryObj;
        pagingObj.limit = (limit) ? parseInt(limit): 2;
        logger.debug(pagingObj.limit);

        if (sortBy) {
            pagingObj.paginatedField = sortBy;
        }

        if (sortAsc) {
            pagingObj.sortAscending = (sortAsc === 'true');
        }

        if (next) {
            pagingObj.next = next;
        }

        if (previous) {
            pagingObj.previous = previous;
        }

        logger.debug(pagingObj);

        const database = config.get('databaseConfig:databases:core');
        return Q(MongoPaging.find(this.collection(config.get('databaseConfig:databases:core')), pagingObj))
            .then((result) => {
                const posts = result.results.map((post) => {
                    post.authors = post.degaUsers;
                    delete post.degaUsers;
                    return post;
                });

                const workers = [];
                posts.forEach((post) => {
                    // query all orgs
                    const tagWorkers = [];
                    post.tags.forEach((tag) => {
                        tagWorkers.push(Q(this.collection(database, tag.namespace).findOne({_id: tag.oid})));
                    });
                    const promiseChain = Q.all(tagWorkers)
                        .then((tags) => {
                            post.tags = tags;
                            const catWorkers = [];
                            post.categories.forEach((category) => {
                                catWorkers.push(Q(this.collection(database, category.namespace).findOne({_id: category.oid})));
                            });
                            return Q.all(catWorkers);
                        }).then((categories) => {
                            post.categories = categories;
                            // query status doc
                            const collection = post.status.namespace;
                            const statusID = post.status.oid;
                            return Q(this.collection(database, collection).findOne({_id: statusID}));
                        }).then((status) => {
                            post.status = status;
                            // query format doc
                            const collection = post.format.namespace;
                            const formatID = post.format.oid;
                            return Q(this.collection(database, collection).findOne({_id: formatID}));
                        }).then((format) => {
                            post.format = format;
                            const authorWorkers = [];
                            post.authors.forEach((author) => {
                                authorWorkers.push(Q(this.collection(database, author.namespace).findOne({_id: author.oid})));
                            });
                            return Q.all(authorWorkers);
                        }).then((authors) => {
                            post.authors = authors;
                            return post;
                        });
                    workers.push(promiseChain);
                }).catch((err) => {
                    logger.error(`Unknown error, ${err}`);
                    throw err;
                });
                // return users;
                return Q.all(workers);
            });
    }
}

module.exports = PostsModel;
