var Nightmare = require('nightmare');
var nightmare = Nightmare({
	openDevtools: false,
	show: true
});
var _ = require('underscore');
var getCSS = require('getcss');
var async = require('async');

// key sites to target
var sites = {};
sites.cal = 'http://www.californiabids.com/';
sites.id = 'http://www.idahobids.com';
sites.mon = 'http://www.montanabids.com/';
sites.nev = 'http://www.nevadabids.com/';
sites.or = 'http://www.oregonbids.com';
sites.ut = 'http://www.utahbids.net';
sites.wa = 'http://www.washingtonbids.com';

var gProps = {
	oEnum: function(obj) {
		return this._getPropertyNames(obj, true, false, this._enumerable);
	},
	oNEnum: function(obj) {
		return this._getPropertyNames(obj, true, false, this._notEnumerable);
	},
	oBoth: function(obj) {
		return this._getPropertyNames(obj, true, false, this._enumerableAndNotEnumerable);
		// Or just use: return Object.getOwnPropertyNames(obj);
	},
	pEnum: function(obj) {
		return this._getPropertyNames(obj, false, true, this._enumerable);
	},
	pNEnum: function(obj) {
		return this._getPropertyNames(obj, false, true, this._notEnumerable);
	},
	pBoth: function(obj) {
		return this._getPropertyNames(obj, false, true, this._enumerableAndNotEnumerable);
	},
	opEnum: function(obj) {
		return this._getPropertyNames(obj, true, true, this._enumerable);
		// Or could use unfiltered for..in
	},
	opNEnum: function(obj) {
		return this._getPropertyNames(obj, true, true, this._notEnumerable);
	},
	opBoth: function(obj) {
		return this._getPropertyNames(obj, true, true, this._enumerableAndNotEnumerable);
	},
	_enumerable: function(obj, prop) {
		return obj.propertyIsEnumerable(prop);
	},
	_notEnumerable: function(obj, prop) {
		return !obj.propertyIsEnumerable(prop);
	},
	_enumerableAndNotEnumerable: function(obj, prop) {
		return true;
	},
	_getPropertyNames: function getAllPropertyNames(obj, iterateSelfBool, iteratePrototypeBool, includePropCb) {
		var props = [];

		do {
			if (iterateSelfBool) {
				Object.getOwnPropertyNames(obj).forEach(function(prop) {
					if (props.indexOf(prop) === -1 && includePropCb(obj, prop)) {
						props.push(prop);
					}
				})
			}
			if (!iteratePrototypeBool) {
				break;
			}
			iterateSelfBool = true;
		} while (obj = Object.getPrototypeOf(obj))
		return props;
	}
};

var urls = Object.values(sites);
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
			});
	});
}, Promise.resolve([])).then(function(results) {
	console.dir(results);
});

// nightmare
// 	.goto(sites.wa)
// 	.evaluate(function(selector, arr, merged, match_arr) {



// 		$(selector).children().each(function() {
// 			if ($(this).text().length > 1) {
// 				arr.push(($(this).text() + ': '));
// 			}
// 		});

// 		function mergeRows(array) {
// 			var i = 0;
// 			var j = 0;
// 			for (i; i < array.length; i += 2,
// 				j++) {
// 				merged[j] = array[i] + array[i + 1];
// 			}
// 		}

// 		function arr_grep(literal_string, target_array) {
// 			var oRegex = new RegExp(literal_string);
// 			for (var i = 0; i < target_array.length; i++) {
// 				var found = String(target_array[i]).search(oRegex);
// 				if (found > -1) {
// 					match_arr.push(target_array[i]);
// 				}
// 			}
// 		}

// 		mergeRows(arr);

// 		arr_grep(/.*building dept.*|.*building deptartment.*|.*plan review.*|.*building plan.*|.*building code.*|.*code compliance.*|.*code review.*|.*plan check.*/ig, merged);
// 	}, selector)
// 	.end()
// 	.then(function(result) {
// 		console.log(result);
// 	})
// 	.catch(function(e) {
// 		console.error(e);
// 	});
