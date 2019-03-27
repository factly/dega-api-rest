'use strict';

module.exports = function (grunt) {

    // Load the project's grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('tasks')
    });

    grunt.registerTask('test:load', [
        'env:unit',        // set environment
        'shell:load_data',      // load data into dega db
    ]);

    grunt.registerTask('lint', ['eslint']);

    grunt.registerTask('test', [
        'test:load',
        'eslint',
        'mocha_istanbul:tests',
    ]);
};
