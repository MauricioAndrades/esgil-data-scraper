"use strict";
var _ = require('underscore');
var async = require('async');
var requireg = require('node-clean-exit');
var Promise = require('bluebird');
var fs = require('fs');
var urls = require('./urls.js');
var keywords = require("./keywords");
var request = Promise.promisifyAll(require("request"));
var promises = [];
var cheerio = require('cheerio');
for(var i = 0; i < urls.length; i++) {
  promises.push(request.getAsync(urls[i]))
}

Promise.all(promises).then(function(){
  fs.writeFile('./promise-results.json', JSON.stringify(promises), 'utf8', function(){
    console.log(promises[0])
  })
})

var cheercheerioLoadPromises = function(data) {
  var $ = cheerio.load(data);
  console.log($)
}

// cheerioLoadPromises("dataParam", function(err, data) {
//   if (err) console.log(err);
//   // name
// });

// document.querySelector('tbody').innerText
// non breaking space '\u00a0'
 // Basically jQuery for node.js

function makecall() {
  urls.forEach(function(val, index) {
    console.log(val);
    var options = {
      uri: val,
      transform: function(body) {
        return cheerio.load(body);
      }
    };
    rp(options)
      .then(function($) {
        var html = $('tbody').html();
        console.log(html);
      })
      .catch(function(err) {
        console.log('failed');
      });
  })
}

function promisifiedCalls() {

}
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
require('node-clean-exit')();
