const MongoPaging = require('mongo-cursor-pagination');
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;
const utils = require('../lib/utils');
class PostsModel extends MongoBase {
    /**
     * Creates a new PostsModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'post');
        this.logger = logger;
    }

    // MANDATORY sub documents: status, format and degaUsers
    // OPTIONAL: All other sub docs are optional
    getPosts(config, clientId, id, slug, categorySlug, tagSlug, authorSlug, sortBy, sortAsc, limit, next, previous) {
        // get query object
        const queryObj = this.getQueryObject(clientId, slug, id);
        this.logger.info(`Query Object ${JSON.stringify(queryObj)}`);

        // get paging object
        const pagingObj = utils.getPagingObject(queryObj, sortBy, sortAsc, limit, next, previous);

        const database = config.get('databaseConfig:databases:core');
        const pagingNew = {};
        return Q(MongoPaging.find(this.collection(config.get('databaseConfig:databases:core')), pagingObj))
            .then((result) => {
                this.logger.info('Converting degaUsers to authors');
                const posts = result.results.map((post) => {
                    post.authors = post.degaUsers;
                    delete post.degaUsers;
                    return post;
                });
                pagingNew.next = result.next;
                pagingNew.hasNext = result.hasNext;
                pagingNew.previous = result.previous;
                pagingNew.hasPrevious = result.hasPrevious;
                this.logger.info('Expanding sub-documents');
                return posts.map((post) => {
                    // query all orgs
                    const tagWorkers = [];
                    if (post.tags && post.tags.length > 0) {
                        post.tags.forEach((tag) => {
                            tagWorkers.push(Q(this.collection(database, tag.namespace).findOne({ _id: tag.oid })));
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
                                    .findOne({ _id: category.oid })));
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
                            return Q(this.collection(database, collection).findOne({ _id: statusID }));
                        }).then((status) => {
                            // filter all posts on Publish posts
                            if (status.name !== 'Publish') {
                                throw Error('SkipPost not published');
                            }

                            post.status = status;
                            if (!post.format) {
                                return Q();
                            }
                            // query format doc
                            const collection = post.format.namespace;
                            const formatID = post.format.oid;
                            return Q(this.collection(database, collection).findOne({ _id: formatID }));
                        }).then((format) => {
                            post.format = format;
                            const authorWorkers = [];
                            if (!post.authors) {
                                return Q();
                            }
                            post.authors.forEach((author) => {
                                authorWorkers.push(Q(this.collection(database, author.namespace)
                                    .findOne({ _id: author.oid })));
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
                                const msg = err.message.split('SkipPost')[1];
                                this.logger.debug(`Ignoring post ${post._id} -${msg}`);
                                return null;
                            }
                            this.logger.error(`Errored on post ${post._id}`);
                            throw err;
                        });
                });
            }).then((arrayOfPromises) => {
                return Q.all(arrayOfPromises);
            }).then((posts) => {
                const result = {};
                result.data = _.compact(posts);
                result.paging = pagingNew;
                return result;
            });
    }
    getQueryObject(clientId, slug, id) {
        const queryObj = {};
        if (clientId) {
            queryObj.client_id = clientId;
        }

        if (slug) {
            queryObj.slug = slug;
        }

        if (id) {
            if (Array.isArray(id)) {
                queryObj._id = { $in: [] };
                for (let element of id) {
                    queryObj._id.$in.push(new ObjectId(element));
                }
            }
            else {
                queryObj._id = new ObjectId(id);
            }
        }
        return queryObj;
    }
}

module.exports = PostsModel;
