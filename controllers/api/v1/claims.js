const ClaimModel = require('../../../models/claim');
const model = new ClaimModel();

function getClaim(req, res) {

    return model.getClaim(
        req.app.kraken,
        req.query.client,
        req.query.rating,
        req.query.claimant).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getClaim);
};
