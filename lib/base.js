

const baseLogger = {
    warn() {
    },
    info() {
    },
    error() {
    },
    debug() {
    }
};

/**
 * This is the base class that all other classes should extend.
 */
class BaseClass {

    constructor(logger) {
        this.logger = logger || baseLogger;
    }
}

module.exports = BaseClass;
