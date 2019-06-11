const RoleModel = require('../../../models/role');
const utils = require('../../../lib/utils');

function getRole(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'roles', 'getRole', req.query.client, null);
    const model = new RoleModel(logger);
    return model.getRole(req.app.kraken,
        req.query.client,
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

module.exports = function routes(router) {
    router.get('/', getRole);
};
