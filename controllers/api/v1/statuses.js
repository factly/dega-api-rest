const StatusModel = require('../../../models/status');
const utils = require('../../../lib/utils');

function getStatus(req, res) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'statuses', 'getStatus', req.query.client, null);
    const model = new StatusModel(logger);
    const clientId = req.query.client;
    return model.getStatus(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getStatus);
};
