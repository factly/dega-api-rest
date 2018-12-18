const CategoryModel = require('../../../models/category');
const model = new CategoryModel();

function getCategory(req, res) {
    const clientId = req.query.client_id;
    return model.getCategory(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getCategory);
};
