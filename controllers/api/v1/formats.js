const FormatModel = require('../../../models/format');
const utils = require('../../../lib/utils');

function getFormats(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'formats', 'getFormats', req.headers.client, null);
    const model = new FormatModel(logger);
    return model.getFormat(
        req.app.kraken,
        req.headers.client,
        req.query.slug).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

function getFormatByKey(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'formats', 'getFormatByKey', req.headers.client, null);
    const model = new FormatModel(logger);
    return model.getFormatByKey(
        req.app.kraken,
        req.headers.client,
        req.params.key).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getFormats);
    router.get('/:key', getFormatByKey);
};
