'use strict';

module.exports = function (grunt) {

    // Load the project's grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('tasks')
    });

    // Register group tasks
    //grunt.registerTask('build', ['eslint', 'copyto']);
    grunt.registerTask('build', ['eslint']);
    grunt.registerTask('test', [ 'eslint', 'mochacli' ]);


    grunt.registerTask('test', [
        'test:prep',
        'eslint:local',
        'mocha_istanbul:tests',
    ]);

    // ESLint options
    grunt.initConfig({
        eslint: {
            options:{
                fix: true
            },
            target: [
                'controllers/**',
                'lib/**',
                'models/**',
                'tasks/**',
                'test/**',
                'index.js',
                'server.js',
            ]
        }
    });

    grunt.registerTask('default', ['eslint']);

};
