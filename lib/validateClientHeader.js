module.exports = function getClientHeaderMiddleware() {
    return async function clientHeader(req, res, next) {
        try {
            if(!req.headers.client){
                res.status(422).json({ error: {
                    message: 'Client ID is missing',
                    code: '500-001',
                    requestId: req.headers['x-request-id'] || null
                } });
            }
        } catch (e) {
            res.status(500).json({
                message: 'Unknown error occured',
                code: '500-000'
            });
        }
        next();
    };
};
