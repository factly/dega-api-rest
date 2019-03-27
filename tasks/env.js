'use strict';

module.exports = function env(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-env');

    return {
        unit: {
            NODE_ENV: 'unit'
        }
    };
};
