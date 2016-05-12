var Nightmare = require('nightmare');
var nightmare = Nightmare({
	show: true
});

var sites = {};
sites.cal = "http://www.californiabids.com/";
sites.nev = "http://www.nevadabids.com/";
sites.mon = "http://www.montanabids.com/";
sites.or = "http://www.oregonbids.com";
sites.wa = "http://www.washingtonbids.com";
sites.ut = "http://www.utahbids.net";
sites.id = "http://www.idahobids.com";

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

nightmare
	.goto(sites[0])
	.wait('#main')
	.end()
	.then(function(result) {
		console.log(result)
	})
	.catch(function(e) {
		console.error(e)
	})
