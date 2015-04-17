/*
 * grunt-mntyjs
 * https://github.com/bitExpert/grunt-mntyjs
 *
 * Copyright (c) 2015 bitExpert
 * Licensed under the Apache 2 license.
 */

module.exports = function (grunt) {
    'use strict';
    var requirejs = require('requirejs');

    // TODO: extend this to send build log to grunt.log.ok / grunt.log.error
    // by overriding the r.js logger (or submit issue to r.js to expand logging support)
    requirejs.define('node/print', [], function () {
        return function print (msg) {
            if (msg.substring(0, 5) === 'Error') {
                grunt.log.errorlns(msg);
                grunt.fail.warn('RequireJS failed.');
            } else {
                grunt.log.oklns(msg);
            }
        };
    });

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('mntyjs', 'Grunt plugin to build your mnty.js project', function () {
        var extractor = require('../lib/extractor'),
            LOG_LEVEL_TRACE = 0,
            LOG_LEVEL_WARN = 2,
            done = this.async(),
            options,
            mounts,
            dataAttr,
            requireTryCatch;

        options = this.options({
            loadFrom: '',
            mountPoint: 'mount',
            include: [],
            logLevel: grunt.option('verbose') ? LOG_LEVEL_TRACE : LOG_LEVEL_WARN,
            done: function (done) {
                done();
            }
        });

        dataAttr = options.mountPoint;

        if (dataAttr.substr(0, 5) !== 'data-') {
            dataAttr = 'data-' + dataAttr;
        }

        //@TODO: Check validity of dataAttr and throw error if invalid

        mounts = extractor(grunt, this.files, options.loadFrom, dataAttr);

        // we do not need the option anymore
        delete options.loadFrom;

        options.include = options.include.concat(mounts);

        // The following catches errors in the user-defined `done` function and outputs them.
        requireTryCatch = function (fn, done, output) {
            try {
                fn(done, output);
            } catch(e) {
                grunt.fail.warn('There was an error while processing your done function: "' + e + '"');
            }
        };

        requirejs.optimize(options, requireTryCatch.bind(null, options.done, done));
    });
};
