const RoleModel = require('../../../models/role');
const model = new RoleModel();

function getRole(req, res) {
    const clientId = req.query.client_id;
    return model.getRole(clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getRole);
};
