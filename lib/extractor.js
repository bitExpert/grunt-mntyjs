/*
 * grunt-mntyjs
 * https://github.com/bitExpert/grunt-mntyjs
 *
 * Copyright (c) 2015 bitExpert AG
 * Licensed under the Apache 2.0 license.
 */

'use strict';

var cheerio = require('cheerio'),
    uniqueFilter,
    extractFromFile,
    extractFromElement,
    extractAll;

/**
 * Filter for unique array occurence
 *
 * @param value
 * @param index
 * @param self
 * @returns {boolean}
 */
uniqueFilter = function uniqueFilter (value, index, self) {
    return self.lastIndexOf(value) === index;
};

/**
 * Gathers the mounts used in the given files
 *
 * @param files
 * @returns {Array}
 */
extractAll = function extractAll (grunt, files, loadFrom, dataAttr) {
    var allMounts = [];
    files.forEach(function (file) {
        //@TODO: resolve file.src to array and iterate over elements
        file.src.forEach(function (fileSrc) {
            allMounts = allMounts.concat(extractFromFile(grunt, fileSrc, dataAttr));
        });
    });

    allMounts = allMounts.filter(uniqueFilter);
    if (loadFrom !== '') {
        allMounts = allMounts.map(function (mount) {
            return (loadFrom + '/' + mount).replace(/\/\//g, '/');
        });
    }

    return allMounts;
};

/**
 * Returns all mounts used in given file
 *
 * @param {Object} file
 * @return {Array}
 */
extractFromFile = function extractFromFile (grunt, file, dataAttr) {
    var srcContents = grunt.file.read(file),
        fileMounts = [],
        $;

    $ = cheerio.load(srcContents, {
        lowerCaseAttributeNames: true
    });

    $('[' + dataAttr + ']').each(function (index, el) {
        fileMounts = fileMounts.concat(extractFromElement($(el), dataAttr));
    });

    return fileMounts;
};

/**
 * Returns all mounts of the given element
 *
 * @param {Object} el
 * @return {Array}
 */
extractFromElement = function extractFromElement (el, dataAttr) {
    var attrValue = el.attr(dataAttr),
        elMounts = [];

    if (attrValue) {
        elMounts = attrValue.split(',');
        elMounts = elMounts.map(function (mount) {
            return mount.trim();
        });
    }

    return elMounts;
};

module.exports = extractAll;
