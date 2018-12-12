const OrganizationModel = require('../../../models/organization');
const model = new OrganizationModel();

function getOrganization(req, res) {
    const clientId = req.query.client_id;
    return model.getOrganization(clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getOrganization);
};
