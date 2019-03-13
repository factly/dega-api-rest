const chance = require('chance')();

module.exports = function () {
    return function (req, res, next) {
        const config = req.app.kraken;
        const guid = chance.guid();

        //if request id is not supplied create one
        if(!req.headers['x-request-id']){
            req.headers['x-request-id'] = guid;
        }

        res.set('X-Request-Id', req.headers['x-request-id']);

        var tokens = {};

        //Pushing known request variables on the array of log tokens
        tokens.request_id = req.headers['x-request-id'];

        next();
    };
};
