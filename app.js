var Nightmare = require('nightmare');
var nightmare = Nightmare({
	openDevtools: true,
	show: true
});
var _ = require('underscore');
var getCSS = require('getcss');
// key sites to target
var sites = {};
sites.cal = 'http://www.californiabids.com/';
sites.id = 'http://www.idahobids.com';
sites.mon = 'http://www.montanabids.com/';
sites.nev = 'http://www.nevadabids.com/';
sites.or = 'http://www.oregonbids.com';
sites.ut = 'http://www.utahbids.net';
sites.wa = 'http://www.washingtonbids.com';
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

nightmare
	.goto(sites.wa)
	.evaluate(function(selector) {
		var arr = [];
		var merged = [];

		$(selector).children().each(function() {
			if ($(this).text().length > 1) {
				arr.push(($(this).text() + ': '))
			}
		})

		function mergeRows(array) {
			var i = 0;
			var j = 0;
			for (i; i < array.length; i += 2,
				j++) {
				merged[j] = array[i] + array[i + 1];
			}
		}

		function matchInArray(regex_obj, arr) {
			var match_arr = [];
			var oRegex = new RegExp(regex_obj);
			for (var i = 0; i < arr.length; i++) {
				var found = String(arr[i]).search(oRegex);
				if (found > -1) {
					match_arr.push(arr[i]);
				}
			}
			return match_arr
		}
		mergeRows(arr)
		matchInArray(/.*building dept.*|.*building deptartment.*|.*plan review.*|.*building plan.*|.*building code.*|.*code compliance.*|.*code review.*|.*plan check.*/ig, merged)
	}, selector)
	.end()
	.then(function(result) {
		console.log(result)
	})
	.catch(function(e) {
		console.error(e)
	})
