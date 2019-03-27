'use strict';


module.exports = function clean(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Options
    return {
        tmp: 'tmp',
        build: '.build/templates',
        coverage : 'coverage/**/*.*',
        jenkins: 'build',
        rpm: 'target/rpm',
        before:{
            src:['.build','dist','temp', 'tmp']
        },
        after: {
            src:['temp', 'dist', 'tmp']
        }
    };
};
