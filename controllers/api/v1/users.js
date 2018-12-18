const UserModel = require('../../../models/user');
const model = new UserModel();

function getUser(req, res) {
    const clientId = req.query.client_id;
    return model.getUser(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        }
        res.sendStatus(404);

    });
}

module.exports = function routes(router) {
    router.get('/', getUser);
};
