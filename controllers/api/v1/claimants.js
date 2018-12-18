const ClaimantModel = require('../../../models/claimant');
const model = new ClaimantModel();

function getClaimant(req, res) {
    const clientId = req.query.client_id;
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
