
const MongoPaging = require('mongo-cursor-pagination');
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const logger = require('logger').createLogger();

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

                return posts.map((post) => {
                    // query all orgs
                    const tagWorkers = [];
                    if (post.tags && post.tags.length > 0) {
                        post.tags.forEach((tag) => {
                            tagWorkers.push(Q(this.collection(database, tag.namespace).findOne({_id: tag.oid})));
                        });
                    }

                    return Q.all(tagWorkers)
                        .then((tags) => {
                            post.tags = tags;
                            const catWorkers = [];
                            if (!post.categories) {
                                return Q();
                            }
                            post.categories.forEach((category) => {
                                catWorkers.push(Q(this.collection(database, category.namespace).findOne({_id: category.oid})));
                            });
                            return Q.all(catWorkers);
                        }).then((categories) => {
                            post.categories = categories;
                            if (!post.status) {
                                return Q();
                            }
                            // query status doc
                            const collection = post.status.namespace;
                            const statusID = post.status.oid;
                            return Q(this.collection(database, collection).findOne({_id: statusID}));
                        }).then((status) => {
                            post.status = status;
                            if (!post.format) {
                                return Q();
                            }
                            // query format doc
                            const collection = post.format.namespace;
                            const formatID = post.format.oid;
                            return Q(this.collection(database, collection).findOne({_id: formatID}));
                        }).then((format) => {
                            post.format = format;
                            const authorWorkers = [];
                            if (!post.authors) {
                                return Q();
                            }
                            post.authors.forEach((author) => {
                                authorWorkers.push(Q(this.collection(database, author.namespace).findOne({_id: author.oid})));
                            });
                            return Q.all(authorWorkers);
                        }).then((authors) => {
                            post.authors = authors;
                            return post;
                        });
                });
            }).then((arrayOfPromises) => {
                return Q.all(arrayOfPromises);
            });
    }
}

module.exports = PostsModel;
