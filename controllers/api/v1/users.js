const UserModel = require('../../../models/user');
const utils = require('../../../lib/utils');

function getUser(req, res, next) {
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
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getUser);
};
