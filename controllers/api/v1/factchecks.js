const FactcheckModel = require('../../../models/factcheck');
const model = new FactcheckModel();

function getFactcheck(req, res) {
    return model.getFactcheck(
        req.app.kraken,
        req.query.client,
        req.query.tag,
        req.query.category,
        req.query.claimant).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getFactcheck);
};
