var json2html = require('node-json2html');
var fs = require('fs');

/*function makeit(callback) {
  var data = JSON.parse(fs.readFileSync('./global-match.json', 'utf8'));
  console.log(data);

  var transform = {
    "<>": "div",
    "class": "panel panel-default",
    "html": [{
      "<>": "div",
      "class": "panel-heading",
      "html": [{
        "<>": "h3",
        "class": "panel-title",
        "html":
      }]
    }, {
      "<>": "div",
      "class": "panel-body",
      "html": "${'4'}"
    }]
  };
  var html = json2html.transform(data, transform);
  callback(html);
}
*/
// makeit(logit);
debugger;
var data = [{
  'male': 'Bob',
  'female': 'Jane'
}, {
  'male': 'Rick',
  'female': 'Ann'
}];

var transform = {
  "<>": "div",
  "html": "${male} likes ${female}"
};

var html = json2html.transform(data, transform);
