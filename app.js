var Nightmare = require('nightmare');
var nightmare = Nightmare({
  openDevtools: false,
  show: true
});
var _ = require('underscore');
var async = require('async');
var spork = require('spork');

// key sites to target
var sites = {};
sites.cal = 'http://www.californiabids.com/';
sites.id = 'http://www.idahobids.com';
sites.mon = 'http://www.montanabids.com/';
sites.nev = 'http://www.nevadabids.com/';
sites.or = 'http://www.oregonbids.com';
sites.ut = 'http://www.utahbids.net';
sites.wa = 'http://www.washingtonbids.com';

var urls = Object.keys(sites);
// the keywords we search for
var keywords = [
  'building department',
  'building dept',
  'building plan',
  'building review',
  'code compliance',
  'code review',
  'plan check',
  'plan review'
];
// document.querySelector('tbody').innerText
// non breaking space '\u00a0'
var selector = 'tbody';
var arr = [];
var merged = [];
var match_arr = [];

urls.reduce(function(accumulator, url) {
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
});

// nightmare
//  .goto(sites.wa)
//  .evaluate(function(selector, arr, merged, match_arr) {

//    $(selector).children().each(function() {
//      if ($(this).text().length > 1) {
//        arr.push(($(this).text() + ': '));
//      }
//    });

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
