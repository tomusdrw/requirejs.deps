/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		files: ['Gruntfile.js', 'src/**/*.js', 'test/*.js'],

		watch: {
			all: {
				files: '<%= files %>'
			}
		},

		simplemocha: {
			all: {
				src: 'test/*.js'
			}
		},

		jshint: {
			all: '<%= files %>'
		},
		
		complexity: grunt.file.readJSON('complexity.json')
	});
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-complexity');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'simplemocha', 'complexity']);

};