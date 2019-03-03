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
            logger.info('Connection successful in the initial attempt');
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

module.exports = utils;
