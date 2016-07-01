"use strict";
var _ = require('underscore');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));
var readFile = Promise.promisify(require("fs").readFile);
var writeFile = Promise.promisify(require("fs").writeFile);
var cheerio = require('cheerio');
var traverse = require('traverse');
var fs = require('fs');
var Readable = require('stream').Readable;
var lodash = require('lodash');
var $;
var urls = require('./urls.js');
var keywords = require("./keywords");
var promises = [];
var cheerioOptions = {
    withDomLvl1: true,
    normalizeWhitespace: false,
    xmlMode: false,
    decodeEntities: true
};
var global_bin = [];
var global_match = [];

/////////////////////////// traverse inspection ///////////////////////////

function scrubobj(obj, callback) {
    var scrubbed =
        traverse(obj).map(function(x) {
            if (this.circular) this.remove();
        });
    callback(scrubbed);
}

function walkobject(obj) {
    let s = '';
    let walked =
        traverse(obj).forEach(function to_s(node) {
            if (Array.isArray(node)) {
                this.before(function() {
                    s += '['
                });
                this.post(function(child) {
                    if (!child.isLast) s += ',';
                });
                this.after(function() {
                    s += ']'
                });
            } else if (typeof node == 'object') {
                this.before(function() {
                    s += '{'
                });
                this.pre(function(x, key) {
                    to_s(key);
                    s += ':';
                });
                this.post(function(child) {
                    if (!child.isLast) s += ',';
                });
                this.after(function() {
                    s += '}'
                });
            } else if (typeof node == 'string') {
                s += '"' + node.toString().replace(/"/g, '\\"') + '"';
            } else if (typeof node == 'function') {
                s += 'null';
            } else {
                s += node.toString();
                s += '\n'
            }
        });
    console.log(walked);
}

////////////////////// start promises //////////////////////

/** push promised requests into an array to resolve */
for (var i = 0; i < urls.length; i++) {
    promises.push(request.getAsync(urls[i]))
}

// Promise.all(Iterable<any>|Promise<Iterable<any>> input) -> Promise
Promise.all(promises).then(function(data) {
    return writeFile('./promise.json', data, 'utf8')
}).then(function() {
    return readFile('./promise-results.json', 'utf8')
}).then(function(contents) {

    var parsed = JSON.parse(contents);

    /** @type {Object} local place to create objs before pushing them */
    var _bin = {};

    /** @type {Number} local count to assemble objects */
    var count = 0;

    /** the results from cheerio parsing */
    var arr = [];

    /**
     * grep through keys, find matches
     */
    function testfind(target) {
        // target is equiv to a td row.
        var oRegex = new RegExp(/.*checking plans.*|.*building dept.*|.*building department.*|.*plan review.*|.*building plan.*|.*building code.*|.*code compliance.*|.*code review.*|.*plan check.*/mig);

        var found = false;

        /** target[key] is one string of a child of td */
        for (var key in target) {
            found = String(target[key]).search(oRegex);
            if (found > -1) {
                return true;
            }
        }
        return false;
    }

    /////////////////////////// cheerio load area  //////////////////////////

    /** for each obj in the full collection read from file */
    for (var j = 0; j < parsed.length; j++) {

        $ = cheerio.load(parsed[j]["body"]);

        /**
         * cheerio parse table body
         */
        $('tbody').children()
            .contents()
            .find('td>a')
            .addBack().each(function() {
                arr.push($(this));
            });

        ///////////////////// extract data from arr of dom elements /////////////////////

        /** loop through array of cheerio objs and pull out the properties we want from td */
        for (var x = 0; x < arr.length; x++) {
            count += 1;
            _bin[count] = $(arr[x]).text();
            if ($(arr)[x].attr('href') !== undefined) {
                _bin[count] = ($(arr)[x].attr('href'));
            }

            /** reset on empty object key === separator line */
            if (_bin[count] === " ") {
                global_bin.push(_bin);
                _bin = {};
                count = 0;
            }
        }
    }
    /**
     * check matches and push them into matches bin if they meet the criteria.
     */
    global_bin.forEach(function(el) {
        if (testfind(el)) {
            global_match.push(el);
        }
    });
}).then(function() {
    if (global_match.length > 0) {
        console.log('matches found!')
        return writeFile('./global-match.json', JSON.stringify(lodash.uniqWith(global_match, lodash.isEqual)), 'utf8');
    }
}).catch((function(err) {
    if (err) {
        console.log(err);
        process.nextTick(function() {
            process.exit(0);
        })
    }
}));

// require('node-clean-exit')();
