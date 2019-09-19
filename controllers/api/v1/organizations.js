const OrganizationModel = require('../../../models/organization');
const utils = require('../../../lib/utils');

function getOrganization(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'organizations', 'getOrganization', req.query.client, null);
    const model = new OrganizationModel(logger);
    return model.getOrganization(
            req.app.kraken, 
            req.query.client
        ).then((result) => {
            if (result) {
                res.status(200).json(result);
                return;
            }
            res.sendStatus(404);
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getOrganization);
};
