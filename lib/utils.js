const Q = require('q');

const utils = function utils() {
};


/**
 * run and retry a function for every 'delay' millis
 * @param {int} maxRetries number of time to loop if error
 * @param {int} delay - delay in milliseconds between try, default 30 seconds
 * @param {object} fn function to execute
 * @param {object} logger - logger
 * @returns {object} - returns result of function
 */
utils.retry = function retry(maxRetries, delay, fn, logger) {
    delay = delay || 30000;
    return fn()
        .then((response) => {
            logger.info('Connection successful in the first attempt');
            return response;
        })
        .catch((err) => {
            if (maxRetries === 0) {
                logger.info('Failed to get connection in all 5 attempts');
                throw err;
            } else {
                const msg = (err) ? err.stack : err;
                logger.error(`Error message: ${msg}`);
                const currentAttempt = maxRetries - 1;
                logger.info(`Trying to connect with a delay of ${delay} millis, attempt #${5 - currentAttempt}`);
                return Q.delay(delay)
                    .then(() => retry(maxRetries - 1, delay, fn, logger));
            }
        });
};

utils.cloneObject = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

utils.setLogTokens = function setLogTokens(logger, controller, operation, clientId, id) {
    logger.tokens.controller = controller;
    logger.tokens.operation = operation;

    if (id) {
        logger.tokens.id = id;
    }

    if (clientId) {
        logger.tokens.clientId = clientId;
    }
};

utils.readErrorObject = function readError(err) {
    if (!err || typeof err === 'function') {
        return;
    }
    const logObject = {};
    if (typeof err === 'string' || err instanceof String || typeof err === 'number') {
        logObject.error_message = err;
    } else if (err instanceof Array) {
        logObject.error_message = err.join(',');
    } else if (err instanceof Error) {
        Object.getOwnPropertyNames(err).forEach((key) => {
            if (typeof err[key] === 'object') {
                logObject[`error_${key}`] = JSON.stringify(err[key]);
            } else if (typeof err[key] !== 'function') {
                logObject[`error_${key}`] = err[key];
            }
        });
        logObject.error_type = err.constructor.name;
    } else if (typeof err === 'object') {
        Object.keys(err).forEach((prop) => {
            // Object might have an empty property value.
            // Of the property is a function on the object.
            if (err[prop] && typeof err[prop] !== 'function') {
                if (typeof err[prop] === 'string' || err[prop] instanceof String || typeof err[prop] === 'number') {
                    logObject[`error_${prop.toString()}`] = err[prop];
                } else if (err[prop] instanceof Array) {
                    if (prop.toString().toLowerCase().indexOf('stack') > -1) {
                        logObject[`error_${prop.toString()}`] = err[prop].join('\n\t');
                    } else {
                        logObject[`error_${prop.toString()}`] = err[prop].join(',');
                    }
                } else {
                    try {
                        logObject[`error_${prop.toString()}`] = JSON.stringify(err[prop]).replace(/"/g, '\'');
                    } catch (e) {
                        // ignore catch
                    }
                }
            }
        });
    }
    return logObject;
};

module.exports = utils;
