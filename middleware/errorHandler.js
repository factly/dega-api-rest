const _ = require('lodash');

module.exports = () => {
    return (err, req, res, next) => {
        try {
            // set tokens for exception handling
            if (req.logger) {
                if (err.stack) {
                    req.logger.setException(err);
                } else {
                    req.logger.tokens.error_message = err.message || '';
                }
            } else {
                /* eslint-disable no-console */
                console.error(err);
            }

            // send response
            if (_.isString(err.message) && _.isString(err.code) && _.isFunction(err.getStatus)) {
                let response = err;

                response.requestId = req.headers['x-request-id'];
                response.message = err.message;
                res.status(response.getStatus()).json({ error: response });

                // Generic errors
            } else {
                res.status(500).json({ error: {
                    message: err.message || '',
                    code: '500-001',
                    requestId: req.headers['x-request-id'] || null
                } });
            }
        } catch (e) {
            const msg = e.message;
            res.status(500).json({
                message: 'Unknown error occured',
                code: '500-000'
            });
        }

        next();
    };
};
