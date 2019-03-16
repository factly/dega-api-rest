const RoleModel = require('../../../models/role');
const utils = require('../../../lib/utils');

function getRole(req, res) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'roles', 'getRole', req.query.client, null);
    const model = new RoleModel(logger);
    const clientId = req.query.client;
    return model.getRole(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getRole);
};
