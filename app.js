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
	.goto(sites.cal)
	.evaluate(function(selector) {
		return document.querySelector(selector).innerText;
	}, selector)
	.end()
	.then(function(result) {
		console.log(result)
	})
	.catch(function(e) {
		console.error(e)
	})
