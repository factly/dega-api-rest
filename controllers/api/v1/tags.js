const TagModel = require('../../../models/tag');
const utils = require('../../../lib/utils');

function getTag(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'tags', 'getTag', req.query.client, null);
    const model = new TagModel(logger);
    return model.getTag(
        req.app.kraken, 
        req.query.client, 
        req.query.sortBy,
        req.query.sortAsc,
        req.query.limit,
        req.query.next,
        req.query.previous
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

function getTagBySlug(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'tags', 'getTagBySlug', req.query.client, null);
    const model = new TagModel(logger);
    return model.getTagBySlug(
        req.app.kraken, 
        req.query.client, 
        req.params.slug
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getTag);
    router.get('/:slug', getTagBySlug);
};
