
const MongoPaging = require('mongo-cursor-pagination');
const MongoBase = require('../lib/MongoBase');
const Q = require('q');

class PostsModel extends MongoBase {
    /**
     * Creates a new PostsModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger, errorCode) {
        super(logger, 'post');
    }

    getPosts(clientId, slug, sortBy, sortAsc, limit, next, previous) {
        const queryObj = {};
        const pagingObj = {};
        console.log('entered model');

        if (clientId) {
            queryObj.client_id = clientId;
        }

        if (slug) {
            queryObj.slug = slug;
        }

        pagingObj.query = queryObj;
        console.log(limit);
        pagingObj.limit = (limit) ? parseInt(limit): 2;
        console.log(pagingObj.limit);

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

        console.log(pagingObj);

        return Q(MongoPaging.find(this.collection(), pagingObj))
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
