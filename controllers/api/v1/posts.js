const PostsModel = require('../../../models/post');
const logger = require('logger').createLogger();
const model = new PostsModel();

function getPosts(req, res) {
    // clientId, slug, sortBy, sortAsc, limit, next, previous
    return model.getPosts(
        req.app.kraken,
        req.query.client,
        req.query.slug,
        req.query.category,
        req.query.tag,
        req.query.author,
        req.query.sortBy,
        req.query.sortAsc,
        req.query.limit,
        req.query.next,
        req.query.previous).then((result) => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.sendStatus(404);
        }
    }).catch((err) => {
        logger.error(`Unknown error with message ${err.message} and stack ${err.stack}`);
        res.status(err.statusCode || 500).json(err.message);
    });
}

module.exports = function routes(router) {
    router.get('/', getPosts);
    router.get('/:slug', getPosts);
};
