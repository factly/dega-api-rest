const StatusModel = require('../../../models/status');
const utils = require('../../../lib/utils');

function getStatus(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'statuses', 'getStatus', req.query.client, null);
    const model = new StatusModel(logger);
    return model.getStatus(
        req.app.kraken, 
        req.query.client)
        .then((result) => {
            if (result) {
                res.status(200).json(result);
                return;
            }
            res.sendStatus(404);
        }).catch(next);
}

function getStatusByKey(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'statuses', 'getStatusByKey', req.query.client, null);
    const model = new StatusModel(logger);
    return model.getStatusByKey(
        req.app.kraken, 
        req.query.client,
        req.params.key)
        .then((result) => {
            if (result) {
                res.status(200).json(result);
                return;
            }
            res.sendStatus(404);
        }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getStatus);
    router.get('/:key', getStatusByKey);
};
