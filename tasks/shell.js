'use strict';

module.exports = function clean(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-shell');

    // Options
    return {
        load_data: {
            command: ['mongo degaUnit mongo-setup/scripts/setup.js',
                'mongo degaUnit mongo-setup/scripts/load-data.js'].join('&&')
        }
    };
};
