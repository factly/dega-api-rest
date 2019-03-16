const ClaimantModel = require('../../../models/claimant');
const utils = require('../../../lib/utils');

function getClaimant(req, res) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'claimants', 'getClaimant', req.query.client, null);
    const model = new ClaimantModel(logger);
    const clientId = req.query.client;
    return model.getClaimant(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getClaimant);
};
