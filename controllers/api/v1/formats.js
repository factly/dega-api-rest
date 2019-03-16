const FormatModel = require('../../../models/format');
const utils = require('../../../lib/utils');

function getFormat(req, res) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'formats', 'getFormat', req.query.client, null);
    const model = new FormatModel(logger);
    const clientId = req.query.client_id;
    return model.getFormat(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getFormat);
};
