const chance = require('chance')();
const Logger = require('../lib/logger');
var onFinished = require('on-finished');

const env = process.env.NODE_ENV || 'development';

// https://github.com/winstonjs/winston
// https://github.com/winstonjs/winston-daily-rotate-file

function LogHandler(degaLogger, tokens, logLevel) {
    this.tokens = tokens;
    this.reqStart = Date.now();
    this.level = logLevel;

    this.info = function (message) {
        degaLogger.info(message, tokens, logLevel);
    };

    this.setException = function(err) {
        degaLogger.setException(err, this.tokens);
    };

    this.debug = function (message) {
        degaLogger.debug(message, tokens, this.level);
    };

    this.error = function (message, err) {
        degaLogger.setException(err, tokens);
        degaLogger.error(message, tokens);
    };

    this.warn = function (message) {
        degaLogger.warn(message, tokens, this.level);
    };
}

module.exports = function (config) {
    // created at the time of application startup
    const degaLogger = new Logger(config);

    return function (req, res, next) {
        const guid = chance.guid();

        //if request id is not supplied create one
        if(!req.headers['x-request-id']){
            req.headers['x-request-id'] = guid;
        }
        res.set('X-Request-Id', req.headers['x-request-id']);

        var tokens = {};
        if (req.logger) {
            tokens = req.logger.tokens;
        }

        //Pushing known request variables on the array of log tokens
        tokens.request_id = req.headers['x-request-id'];

        // get the log level from request header if defined
        const logLevel = req.headers['x-logging-level'];
        res.logger = req.logger = new LogHandler(degaLogger, tokens, logLevel);

        onFinished(res, function(err, res) {
            res.logger.tokens.url = req.originalUrl;
            res.logger.tokens.method = req.method;
            res.logger.tokens.env = env;
            res.logger.tokens.remote_ip = req.ip;
            res.logger.tokens.status = res.statusCode.toString();
            res.logger.tokens.response_time = `${(Date.now() - res.logger.reqStart).toString()} millis`;


            const isError = res.logger.tokens.error_message || res.logger.tokens.error_stack;
            if(isError) {
                res.logger.error();
            } else if(res.logger.level === 'warn') {
                res.logger.warn();
            } else {
                res.logger.info();
            }
        });

        next();
    };
};
