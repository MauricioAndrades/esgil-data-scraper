var cheerio = require('cheerio');
var fs = require('fs');
var input = fs.readFileSync('./html.html', 'utf8');
var $ = cheerio.load(input);



console.log('---');
console.log($('li.item-a').closest().prop('class'))
