const CategoryModel = require('../../../models/category');
const utils = require('../../../lib/utils');

function getCategory(req, res) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'factchecks', 'getFactcheck', req.query.client, null);
    const model = new CategoryModel(logger);
    const clientId = req.query.client;
    return model.getCategory(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getCategory);
};
