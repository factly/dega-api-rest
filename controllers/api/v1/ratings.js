const RatingModel = require('../../../models/rating');
const utils = require('../../../lib/utils');

function getRating(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'ratings', 'getRating', req.query.client, null);
    const model = new RatingModel(logger);
    return model.getRating(
        req.app.kraken, 
        req.query.client
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getRating);
};
