const RatingModel = require('../../../models/rating');
const utils = require('../../../lib/utils');

function getRating(req, res) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'ratings', 'getRating', req.query.client, null);
    const model = new RatingModel(logger);
    const clientId = req.query.client;
    return model.getRating(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getRating);
};
