'use strict';

module.exports = function (grunt) {

    // Load the project's grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('tasks')
    });

    // Register group tasks
    grunt.registerTask('build', ['eslint', 'eslint', 'copyto']);
    //grunt.registerTask('build', ['eslint', 'eslint']);
    grunt.registerTask('test', [ 'eslint', 'mochacli' ]);

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
                'server.js'
            ]
        }
    });

    grunt.registerTask('default', ['eslint']);
    
};
