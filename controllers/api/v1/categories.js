const CategoryModel = require('../../../models/category');
const utils = require('../../../lib/utils');

function getCategory(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'factchecks', 'getFactcheck', req.query.client, null);
    const model = new CategoryModel(logger);
    const clientId = req.query.client;
    return model.getCategory(
        req.app.kraken, 
        clientId, 
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

module.exports = function routes(router) {
    router.get('/', getCategory);
};
