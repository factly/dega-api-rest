const PostsModel = require('../../../models/post');
const utils = require('../../../lib/utils');

function getPosts(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'posts', 'getPosts', req.query.client, null);
    const model = new PostsModel(logger);
    return model.getPosts(
        req.app.kraken,
        req.query.client,
        req.query.id,
        req.params.slug ? req.params.slug : req.query.slug,
        req.query.category,
        req.query.tag,
        req.query.user,
        req.query.sortBy,
        req.query.sortAsc,
        req.query.limit,
        req.query.next,
        req.query.previous,
        logger)
        .then((result) => {
            if (result) {
                res.status(200).json(result);
                return;
            }
            res.sendStatus(404);
        })
        .catch(next);
}

module.exports = function routes(router) {
    router.get('/', getPosts);
    router.get('/:slug', getPosts);
};
