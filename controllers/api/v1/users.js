const UserModel = require('../../../models/user');
const utils = require('../../../lib/utils');

function getUser(req, res) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'users', 'getUser', req.query.client, null);
    const model = new UserModel(logger);
    const clientId = req.query.client;
    return model.getUser(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.sendStatus(404);
        }
    }).catch((err) => {
        logger.error(`Unknown error with message ${err.message} and stack ${err.stack}`);
        res.status(err.statusCode || 500).json(err.message);
    });
}

module.exports = function routes(router) {
    router.get('/', getUser);
};
