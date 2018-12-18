const FactcheckModel = require('../../../models/factcheck');
const model = new FactcheckModel();

function getFactcheck(req, res) {
    const clientId = req.query.client_id;
    return model.getFactcheck(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getFactcheck);
};
