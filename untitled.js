var settings = require('/Users/Op/Library/Application Support/Sublime Text 3/allsettings.txt');
var keys = Object.keys(settings)
var path = require('path');
var fs = require('fs');

function write(obj, callback){
  for(var key in obj) {
    var path = key;
    var data = (JSON.stringify(obj[key]));
    callback(path, data);
  }
}

function test(output, info) {
  var sublime = "/Users/Op/Library/Application Support/Sublime Text 3/";
  var norm = path.normalize(path.join(sublime + output));
  var resolved = path.resolve(norm);
  console.log(JSON.stringify(resolved));
  console.log(info);
  fs.writeFile(resolved, info, 'utf8', function(err){
    if (err) console.log(err);
  });
}

write(settings, test);
