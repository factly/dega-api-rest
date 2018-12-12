const RatingModel = require('../../../models/rating');
const model = new RatingModel();

function getRating(req, res) {
    const clientId = req.query.client_id;
    return model.getRating(clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getRating);
};
