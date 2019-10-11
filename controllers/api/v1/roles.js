const RoleModel = require('../../../models/role');
const utils = require('../../../lib/utils');

function getRoles(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'roles', 'getRole', req.headers.client, null);
    const model = new RoleModel(logger);
    return model.getRole(req.app.kraken,
        req.headers.client,
        req.query.slug,
        req.query.sortBy,
        req.query.sortAsc,
        req.query.limit,
        req.query.next,
        req.query.previous)
        .then((result) => {
            if (result) {
                res.status(200).json(result);
                return;
            }
            res.sendStatus(404);
        })
        .catch(next);
}

function getRoleByKey(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'roles', 'getRoleByKey', req.headers.client, null);
    const model = new RoleModel(logger);
    return model.getRoleByKey(
        req.app.kraken,
        req.headers.client,
        req.params.key)
        .then((result) => {
            if (result) {
                res.status(200).json(result);
                return;
            }
            res.sendStatus(404);
        })
        .catch(next);
}

module.exports = function routes(router) {
    router.get('/', getRoles);
    router.get('/:key', getRoleByKey);
};
