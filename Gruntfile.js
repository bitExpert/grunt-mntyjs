/*
 * grunt-mntyjs
 * https://github.com/bitExpert/grunt-mntyjs
 *
 * Copyright (c) 2015 bitExpert AG
 * Licensed under the Apache 2.0 license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'lib/*.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        jscs: {
            src: [
                'Gruntfile.js',
                'lib/*.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                config: 'node_modules/bitexpert-cs-jscs/config/config.json'
            }
        },
        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: [
                'tmp'
            ]
        },

        // Configuration to be run (and then tested).
        mntyjs: {
            cli: {
                options: {
                    mountPoint: 'data-plugins'
                },
                files: {
                    src: [
                        'test/fixtures/test.html'
                    ]
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: [
                'test/*_test.js'
            ]
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'mntyjs', 'nodeunit']);

    // By default, lint and check style
    // @TODO: write and add tests here
    grunt.registerTask('default', ['jshint', 'jscs']);

};
