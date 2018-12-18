const TagModel = require('../../../models/tag');
const model = new TagModel();

function getTag(req, res) {
    const clientId = req.query.clientId;
    return model.getTag(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getTag);
};
