'use strict';

var express = require('express');
var kraken = require('kraken-js');
var db = require('./lib/database.js');
var cors = require('cors');
var DegaLogger = require('./lib/logger');
var options, app;
let logger;
/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {
        logger = new DegaLogger(config.get('middleware').logger.module.arguments[0]);
        db.config(config.get('databaseConfig'), logger)
            .then(() => {
                logger.debug('Database setup is complete');
            });
        /*
         * Add any additional config setup or overrides here. `config` is an initialized
         * `confit` (https://github.com/krakenjs/confit/) configuration object.
         */
        next(null, config);
    }
};

app = module.exports = express();

app.use(cors());
app.use(kraken(options));
app.on('start', function () {
    logger.debug('Application ready to serve requests.');
    logger.debug(`Environment: ${app.kraken.get('env:env')}`);
});
