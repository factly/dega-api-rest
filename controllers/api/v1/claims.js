const ClaimModel = require('../../../models/claim');
const utils = require('../../../lib/utils');

function getClaim(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'claims', 'getClaim', req.query.client, null);
    const model = new ClaimModel(logger);
    return model.getClaim(
        req.app.kraken,
        req.query.client,
        req.query.rating,
        req.query.claimant).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getClaim);
};
