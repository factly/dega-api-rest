'use strict';

module.exports = function copyto(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-copy-to');

    // Options
    return {
        copy: {
            files: [{
                cwd: 'public',
                src: ['**/*'],
                dest: '.build/'
            }]
        }
    };
};

