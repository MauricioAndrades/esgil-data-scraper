"use strict";
var _ = require('underscore');
var async = require('async');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require("request"));
var readFile = Promise.promisify(require("fs").readFile);
var writeFile = Promise.promisify(require("fs").writeFile);
var urls = require('./urls.js');
var keywords = require("./keywords");
var promises = [];
var cheerio = require('cheerio');
var traverse = require('traverse');
var fs = require('fs');
var Readable = require('stream').Readable;
var $;
var masteraccum = [];
var cheerioOptions = {
    withDomLvl1: true,
    normalizeWhitespace: false,
    xmlMode: false,
    decodeEntities: true
};
var global_bin = [];

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
     * @param  {[type]} literal_string [description]
     * @param  {[type]} target_array   [description]
     * @return {[type]}                [description]
     */
    function testfind(target) {

        var oRegex = new RegExp(/.*building.*|.*building dept.*|.*building department.*|.*plan review.*|.*building plan.*|.*building code.*|.*code compliance.*|.*code review.*|.*plan check.*/mig);

        var found = String(target[i]).search(oRegex);

        if (found > -1) {
            // match_arr.push(target[i]);
            return true;
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
debugger;
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

        /** check the objects for matched keys */
        for (var k = 0; k < global_bin.length; k++) {
            for (var key in global_bin[k]) {
                //////////////////////////////////// insert test find logic here
                if (testfind(global_bin[key]) === true) {
                    console.log(global_bin[key]);
                }
            }
        }
    }
}).catch(function(err) {
    if (err) console.log(err);
});

require('node-clean-exit')();
// document.querySelector('tbody').innerText
// non breaking space '\u00a0'
// Basically jQuery for node.js

/*urls.reduce(function(accumulator, url) {
  return accumulator.then(function(results) {
    return nightmare.goto(url)
      .wait('body')
      .evaluate(function(result) {
        return document.querySelector('tbody').innerText;
      })
      .then(function(result) {
        results.push(result);
        return results;
      })
  });
}, Promise.resolve([])).then(function(results) {
  console.dir(results);
});*/

// nightmare
//   .goto(sites.wa)
//   .evaluate(function(selector, arr, merged, match_arr) {

//       $(selector).children().each(function() {
//         if ($(this).text().length > 1) {
//           arr.push(($(this).text() + ': '));
//         }
//       });

//    function mergeRows(array) {
//      var i = 0;
//      var j = 0;
//      for (i; i < array.length; i += 2,
//        j++) {
//        merged[j] = array[i] + array[i + 1];
//      }
//    }

//    function arr_grep(literal_string, target_array) {
//      var oRegex = new RegExp(literal_string);
//      for (var i = 0; i < target_array.length; i++) {
//        var found = String(target_array[i]).search(oRegex);
//        if (found > -1) {
//          match_arr.push(target_array[i]);
//        }
//      }
//    }

//    mergeRows(arr);

//   arr_grep(/.*building dept.*|.*building deptartment.*|.*plan review.*|.*building plan.*|.*building code.*|.*code compliance.*|.*code review.*|.*plan check.*/ig, merged);
// }, selector)
// .end()
// .then(function(result) {
//   console.log(result);
// })
// .catch(function(e) {
//   console.error(e);
// });
