const FormatModel = require('../../../models/format');
const utils = require('../../../lib/utils');

function getFormat(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'formats', 'getFormat', req.query.client, null);
    const model = new FormatModel(logger);
    return model.getFormat(
        req.app.kraken,
        req.query.client,
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
    utils.setLogTokens(logger, 'formats', 'getFormatByKey', req.query.client, null);
    const model = new FormatModel(logger);
    return model.getFormatByKey(
        req.app.kraken,
        req.query.client,
        req.params.key).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getFormat);
    router.get('/:key', getFormatByKey);
};
