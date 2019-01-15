const UserModel = require('../../../models/user');
const logger = require('logger').createLogger();
const model = new UserModel();

function getUser(req, res) {
    const clientId = req.query.client_id;
    return model.getUser(req.app.kraken, clientId).then((result) => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.sendStatus(404);
        }
    }).catch((err) => {
        logger.error(`Unknown error with message ${err.message} and stack ${err.stack}`);
        res.status(err.statusCode || 500).json(err.message);
    });
}

module.exports = function routes(router) {
    router.get('/', getUser);
};
