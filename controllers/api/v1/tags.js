const TagModel = require('../../../models/tag');
const utils = require('../../../lib/utils');

function getTags(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'tags', 'getTags', req.headers.client, null);
    const model = new TagModel(logger);
    return model.getTag(
        req.app.kraken, 
        req.headers.client, 
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

function getTagByKey(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'tags', 'getTagByKey', req.headers.client, null);
    const model = new TagModel(logger);
    return model.getTagByKey(
        req.app.kraken, 
        req.headers.client, 
        req.params.key
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getTags);
    router.get('/:key', getTagByKey);
};
