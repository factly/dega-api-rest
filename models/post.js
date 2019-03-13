const MongoPaging = require('mongo-cursor-pagination');
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const _ = require('lodash');
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

    getPosts(config, clientId, slug, categorySlug, tagSlug, authorSlug, sortBy, sortAsc, limit, next, previous) {
        // get query object
        const queryObj = this.getQueryObject(clientId, slug);
        logger.info(`Query Object ${JSON.stringify(queryObj)}`);

        // get paging object
        const pagingObj = this.getPagingObject(queryObj, sortBy, sortAsc, limit, next, previous);

        const database = config.get('databaseConfig:databases:core');
        return Q(MongoPaging.find(this.collection(config.get('databaseConfig:databases:core')), pagingObj))
            .then((result) => {
                const posts = result.results.map((post) => {
                    post.authors = post.degaUsers;
                    delete post.degaUsers;
                    return post;
                });
                logger.info(`Posts retrieved ${posts.length}`);

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
                            const tagSlugs = tags.map(tag => tag.slug);
                            const isTagFound = tagSlugs.includes(tagSlug);
                            if (tagSlug && !isTagFound) {
                                throw Error('SkipPost tag slug not found');
                            }
                            post.tags = tags;
                            const catWorkers = [];
                            if (!post.categories) {
                                return Q();
                            }
                            post.categories.forEach((category) => {
                                catWorkers.push(Q(this.collection(database, category.namespace)
                                    .findOne({_id: category.oid})));
                            });
                            return Q.all(catWorkers);
                        }).then((categories) => {
                            const categorySlugs = categories.map(category => category.slug);
                            const isCategoryFound = categorySlugs.includes(categorySlug);
                            if (categorySlug && !isCategoryFound) {
                                throw Error('SkipPost category slug not found');
                            }

                            post.categories = categories;
                            if (!post.status) {
                                return Q();
                            }
                            // query status doc
                            const collection = post.status.namespace;
                            const statusID = post.status.oid;
                            return Q(this.collection(database, collection).findOne({_id: statusID}));
                        }).then((status) => {
                            // filter all posts on Publish posts
                            if (status.name !== 'Publish') {
                                throw Error('SkipPost post not published');
                            }

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
                                authorWorkers.push(Q(this.collection(database, author.namespace)
                                    .findOne({_id: author.oid})));
                            });
                            return Q.all(authorWorkers);
                        }).then((authors) => {
                            const authorSlugs = authors.map(author => author.slug);
                            const isAuthorFound = authorSlugs.includes(authorSlug);
                            if (authorSlug && !isAuthorFound) {
                                throw Error('SkipPost author slug not found');
                            }

                            post.authors = authors;
                            return post;
                        }).catch((err) => {
                            if (err && err.message.startsWith('SkipPost')) {
                                logger.warn(`Skipped the post with message ${err}`);
                                return null;
                            }
                            throw err;
                        });
                });
            }).then((arrayOfPromises) => {
                return Q.all(arrayOfPromises);
            }).then(posts => _.compact(posts));
    }

    getPagingObject(queryObj, sortBy, sortAsc, limit, next, previous) {
        const pagingObj = {};
        pagingObj.query = queryObj;
        pagingObj.limit = (limit) ? parseInt(limit): 20;

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
        return pagingObj;
    }

    getQueryObject(clientId, slug) {
        const queryObj = {};
        if (clientId) {
            queryObj.client_id = clientId;
        }

        if (slug) {
            queryObj.slug = slug;
        }
        return queryObj;
    }
}

module.exports = PostsModel;
