const ClaimModel = require('../../../models/claim');
const model = new ClaimModel();

function getClaim(req, res) {
    const clientId = req.query.client_id;
    return model.getClaim(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getClaim);
};
