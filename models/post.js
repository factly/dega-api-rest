
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

        return Q(MongoPaging.find(this.collection(config.get('databaseConfig:databases:core')), pagingObj))
            .then((result) => {
                const posts = result.results;
                return posts.map((post) => {
                    const degaUsers = post.degaUsers;
                    delete post.degaUsers;
                    post.authors = degaUsers;
                    return post;
                });
            });
    }
}

module.exports = PostsModel;
