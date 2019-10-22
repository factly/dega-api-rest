'use strict';

module.exports = function clean(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-shell');
    
    // Options
    return {
        load_data: {
            command: [ 'mongo degaUnit mongo-setup/scripts/setup.js',
                'mongo degaUnit mongo-setup/data/organizations.js', 
                'mongo degaUnit mongo-setup/data/medias.js',
                'mongo degaUnit mongo-setup/data/roles.js',
                'mongo degaUnit mongo-setup/data/role_mappings.js',
                'mongo degaUnit mongo-setup/data/categories.js',
                'mongo degaUnit mongo-setup/data/claimants.js',
                'mongo degaUnit mongo-setup/data/claims.js',
                'mongo degaUnit mongo-setup/data/factchecks.js',
                'mongo degaUnit mongo-setup/data/formats.js',
                'mongo degaUnit mongo-setup/data/posts.js',
                'mongo degaUnit mongo-setup/data/ratings.js',
                'mongo degaUnit mongo-setup/data/statuses.js',
                'mongo degaUnit mongo-setup/data/tags.js',
                'mongo degaUnit mongo-setup/data/users.js',                
                ].join('&&')
        }
    };
};
