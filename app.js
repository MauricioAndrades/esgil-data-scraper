var Nightmare = require('nightmare');
var nightmare = Nightmare({
	show: true
});
var getCSS = require('getcss');

// key sites to target
var sites = {};
sites.cal = "http://www.californiabids.com/";
sites.id = "http://www.idahobids.com";
sites.mon = "http://www.montanabids.com/";
sites.nev = "http://www.nevadabids.com/";
sites.or = "http://www.oregonbids.com";
sites.ut = "http://www.utahbids.net";
sites.wa = "http://www.washingtonbids.com";

// the keywords we search for
var keywords = [
	"building department",
	"building dept",
	"building plan",
	"building review",
	"code compliance",
	"code review",
	"plan check",
	"plan review"
];

// csstags
var tags = [];
var selector = window.document.querySelector('body');
var options = {
	simple: false
}

getCss.getTags(selector, tags, options);

console.log(tags);

nightmare
	.goto(sites.cal)
	.wait('#main')
	.end()
	.then(function(result) {
		console.log(result)
	})
	.catch(function(e) {
		console.error(e)
	})
