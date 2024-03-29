const UserModel = require('../../../models/user');
const utils = require('../../../lib/utils');

function getUsers(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'users', 'getUsers', req.headers.client, null);
    const model = new UserModel(logger);
    return model.getUser(
        req.app.kraken, 
        req.headers.client,
        req.query.role, 
        req.query.sortBy,
        req.query.sortAsc,
        req.query.limit,
        req.query.next,
        req.query.previous
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.sendStatus(404);
        }
    }).catch(next);
}

function getUserByKey(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'users', 'getUserByKey', req.headers.client, null);
    const model = new UserModel(logger);
    return model.getUserByKey(
        req.app.kraken, 
        req.headers.client,
        req.params.key
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.sendStatus(404);
        }
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getUsers);
    router.get('/:key', getUserByKey);
};
