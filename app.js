var Nightmare = require('nightmare');
var nightmare = Nightmare({
	show: true
});

var sites = [
	"http://www.californiabids.com/",
	"http://www.nevadabids.com/",
	"http://www.montanabids.com/",
	"http://www.oregonbids.com",
	"http://www.washingtonbids.com",
	"http://www.utahbids.net",
	"http://www.idahobids.com"
];

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
