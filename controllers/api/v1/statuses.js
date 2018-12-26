const StatusModel = require('../../../models/status');
const model = new StatusModel();

function getStatus(req, res) {
    const clientId = req.query.clientId;
    return model.getStatus(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getStatus);
};
