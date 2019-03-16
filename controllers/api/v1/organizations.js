const OrganizationModel = require('../../../models/organization');
const utils = require('../../../lib/utils');

function getOrganization(req, res) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'organizations', 'getOrganization', req.query.client, null);
    const model = new OrganizationModel(logger);
    const clientId = req.query.client;
    return model.getOrganization(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getOrganization);
};
