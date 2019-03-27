'use strict';

module.exports = function clean(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    // Options
    return {
        tests: {
            src: ['test/**/*.js'],
            options: {
                timeout: 10000,
                'check-leaks': true,
                reportFormats: ['lcov', 'text']
            }
        }
    };
};
