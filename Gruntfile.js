module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.initConfig({
        uglify: {
            main: {
                files: {
                    'tile.min.js': ['tile.js']
                }
            },
            options: {
                preserveComments: "some"
            }
        }
    });
    grunt.registerTask('default', ['uglify']);
};
