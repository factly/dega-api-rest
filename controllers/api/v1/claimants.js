const ClaimantModel = require('../../../models/claimant');
const utils = require('../../../lib/utils');

function getClaimants(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'claimants', 'getClaimants', req.headers.client, null);
    const model = new ClaimantModel(logger);
    return model.getClaimant(
        req.app.kraken,
        req.headers.client,
        req.query.sortBy,
        req.query.sortAsc,
        req.query.limit,
        req.query.next,
        req.query.previous)
        .then((result) => {
            if (result) {
                res.status(200).json(result);
                return;
            }
            res.sendStatus(404);
        })
        .catch(next);
}

function getClaimantByKey(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'claimants', 'getClaimantByKey', req.headers.client, null);
    const model = new ClaimantModel(logger);
    return model.getClaimantByParam(
        req.app.kraken,
        req.headers.client,
        req.params.key
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    })
        .catch(next);
}

module.exports = function routes(router) {
    router.get('/', getClaimants);
    router.get('/:key', getClaimantByKey);
};
