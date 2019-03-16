const fs = require('fs');
const _ = require('lodash');
const utils = require('../lib/utils');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
require('winston-daily-rotate-file');

const Logger = function Logger(configuration) {
    this.config = configuration;

    const degaTransports = [];
    if (this.config.writeToDisk) {
    // Create the log folder if it does not exist
        if (!fs.existsSync(this.config.logDir)) {
            fs.mkdirSync(this.config.logDir);
        }

        const component = (this.config.component) ? `${this.config.component}-%DATE%.log` : 'application-%DATE%.log';
        var transport = new (transports.DailyRotateFile)({
            name: 'dega-log',
            level: this.config.level,
            filename: `${this.config.logDir}/${component}`,
            showLevel: false,
            exitOnError: false,
            json: false,
            maxsize: 15000000,
            maxFiles: 10,
            colorize: false,
            datePattern: 'YYYY-MM-DD'
        });
        degaTransports.push(transport);
    }

    if (this.config.writeToConsole) {
        var consoleTransport = new (transports.Console)({
            level: 'debug',
            showLevel: true,
            json: false,
            colorize: false
        });
        degaTransports.push(consoleTransport);
    }

    const myFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
    });

    // New instance of Winston logger
    this.logger = createLogger({
        format: combine(
            label({ label: 'DEGA-API' }),
            timestamp(),
            myFormat
        ),
        defaultMeta: { service: 'dega-service' },
        transports: degaTransports
    });
};

Logger.prototype.setLevel = function setLevel(level) {
    this.logger.level = level;
    this.config.level = level;

    this.logger.transports.forEach((item) => {
        item.level = level;
    });
};

Logger.prototype.debug = function info(message, tokens, overwriteLevel) {
    if (overwriteLevel) {
        this.setLevel(overwriteLevel);
    }
    this.logger.debug(getTokensAsMsg(message, tokens));
};

Logger.prototype.info = function info(message, tokens) {
    this.logger.info(getTokensAsMsg(message, tokens));
};

Logger.prototype.warn = function info(message, tokens) {
    this.logger.warn(getTokensAsMsg(message, tokens));
};

Logger.prototype.error = function error(message, tokens, stack) {
    if (!tokens) {
        tokens = {};
    }
    if (stack && stack !== null) {
        tokens.error_stack = stack;
    }
    if (message && message !== null) {
        tokens.error_message = message;
    }
    const msg = getTokensAsMsg(null, tokens);
    this.logger.error(msg);
};

/* eslint-disable no-unused-vars */
Logger.prototype.setException = function setException(err, tokens) {
    const logObject = utils.readErrorObject(err);
    tokens = _.merge(tokens, logObject);
};

function getTokensAsMsg(message, tokens) {
    if (!tokens) {
        return (!message) ? '' : message;
    }

    let msg = '';
    Object.keys(tokens).forEach((key) => {
        if (key === 'message') {
            return;
        }
        msg = `${msg}${key}=${tokens[key]} `;
        return msg;
    });

    const m = (message) ? `${msg} message='${message}'`: msg;
    return m;
}

module.exports = Logger;
