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
var fs = require('fs');
var $;
var htmltojson = require('html-to-json')

////////////////////
// start promises //
////////////////////
const cheerio_options = {
  withDomLvl1: true,
  normalizeWhitespace: false,
  xmlMode: false,
  decodeEntities: true
};

/** push promised requests into an array to resolve */
for (var i = 0; i < urls.length; i++) {
  promises.push(request.getAsync(urls[i]))
}

// Promise.all(Iterable<any>|Promise<Iterable<any>> input) -> Promise
Promise.all(promises).then(function(data) {
  /** write the file to the disk */
  return writeFile('./promise.json', data, 'utf8')
}).then(function() {
  /** now we have a static asset we can play with */
  return readFile('./promise-results.json', 'utf8')
}).then(function(contents) {
    /**
     * parse the file back to a JSON object
     */
    /**
     * loop through all promises returned and cheerio load the content
     * @return {[type]}     [description]
     */
      var parsed = JSON.parse(contents);
      var html = cheerio.load(parsed[0]["body"]);
      var _html = (html.html().toString());
      console.log(_html)
    htmltojson.parse(_html, {
          $row: '.row2',
          'children': function ($row) {
            return $row.find('.tbody').text();
          }
      }, function(){
        console.log(_html);
      })

    function parse (html, filter, callback) {
      var isCheerioObject = typeof html === 'object' && html._root._root;

      if (typeof html !== 'string' && !isCheerioObject) {
        throw new Error('HTML string required');
      }

      var $ = cheerio.load(html);

      var parseContext = new ParseContext({
        $: $,
        $container: isCheerioObject? html: $.root(),
        filter: filter
      });

      return callbackify(parseContext.parse(), callback);
    }
      // console.log(html);
      /**
       * html parser here instead of using cheerio
       */

      /** cheerio */

      /*$('tbody').children().each(function() {
        var $this = $(this);
        var html = $this.html();

        obj.dueDate = $(this).children().attr("td[data-th*='Date']").text();
        obj.location = $(this).children().attr("td[data-th*='Owner ']").text();
        obj.title = $(this).children("td[data-th*='Solicitation']").children('a').attr('title');
        obj.href = $(this).children("td[data-th*='Solicitation']").children('a').attr('href');
        arr.push(obj);
      })*/

  }).then(function(table){
    console.log(table)
  }).catch(function(err) {
  if (err) console.log(err);
});

/*function readtheme(callback){
  fs.readFile("/Users/Op/Library/Application Support/Sublime Text 3/Packages/User/Themes/modmonokaiJS2.tmTheme", 'utf8', function(err, data){
    if(err)console.log(err);
    callback(data);
  })
}*/

// function cheerioLoadTheme(filedata) {
//   $ = cheerio.load(filedata, cheerio_options);
//   var arr = [];
//   var Divs = function(key) {
//     this[key] = $(this).text();
//   }
//   $('dict').children().each(function() {
//     return new Divs($(this).att)
//   })
// }

// readtheme(cheerioLoadTheme);
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
