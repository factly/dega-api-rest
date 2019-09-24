const UserModel = require('../../../models/user');
const utils = require('../../../lib/utils');

function getUser(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'users', 'getUser', req.query.client, null);
    const model = new UserModel(logger);
    return model.getUser(
        req.app.kraken, 
        req.query.client,
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

function getUserBySlug(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'users', 'getUser', req.query.client, null);
    const model = new UserModel(logger);
    return model.getUserBySlug(
        req.app.kraken, 
        req.query.client,
        req.params.slug
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.sendStatus(404);
        }
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getUser);
    router.get('/:slug', getUserBySlug);
};
