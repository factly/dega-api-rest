const ClaimModel = require('../../../models/claim');
const utils = require('../../../lib/utils');

function getClaims(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'claims', 'getClaims', req.headers.client, null);
    const model = new ClaimModel(logger);
    return model.getClaim(
        req.app.kraken,
        req.headers.client,
        req.query.rating,
        req.query.claimant,
        req.query.sortBy,
        req.query.sortAsc,
        req.query.limit,
        req.query.next,
        req.query.previous).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

function getClaimByKey(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'claims', 'getClaimByKey', req.headers.client, null);
    const model = new ClaimModel(logger);
    return model.getClaimByKey(
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
    router.get('/', getClaims);
    router.get('/:key', getClaimByKey);
};
