const TagModel = require('../../../models/tag');
const utils = require('../../../lib/utils');

function getTag(req, res) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'tags', 'getTag', req.query.client, null);
    const model = new TagModel(logger);
    const clientId = req.query.client;
    return model.getTag(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getTag);
};
