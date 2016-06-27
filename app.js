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
var $;

////////////////////
// start promises //
////////////////////

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
  for (var i = 0; i < parsed.length; i++) {
    var $ = cheerio.load(parsed[i]["body"]);
    console.log($('tbody').text().trim());
  }
}).catch(function(err) {
  if(err) console.log(err);
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

//    arr_grep(/.*building dept.*|.*building deptartment.*|.*plan review.*|.*building plan.*|.*building code.*|.*code compliance.*|.*code review.*|.*plan check.*/ig, merged);
//  }, selector)
//  .end()
//  .then(function(result) {
//    console.log(result);
//  })
//  .catch(function(e) {
//    console.error(e);
//  });
