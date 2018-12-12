const FormatModel = require('../../../models/format');
const model = new FormatModel();

function getFormat(req, res) {
    const clientId = req.query.client_id;
    return model.getFormat(clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getFormat);
};
