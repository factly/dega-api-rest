const RatingModel = require('../../../models/rating');
const utils = require('../../../lib/utils');

function getRatings(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'ratings', 'getRatings', req.headers.client, null);
    const model = new RatingModel(logger);
    return model.getRating(
        req.app.kraken, 
        req.headers.client
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

function getRatingByKey(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'ratings', 'getRatingByKey', req.headers.client, null);
    const model = new RatingModel(logger);
    return model.getRatingByKey(
        req.app.kraken, 
        req.headers.client,
        req.params.key
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getRatings);
    router.get('/:key', getRatingByKey);
};
