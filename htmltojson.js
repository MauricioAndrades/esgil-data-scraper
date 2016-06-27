var htmlToJson = require('html-to-json');

var html = '<div id="foo"><div id="bar">foobar</div></div>';

htmlToJson.parse(html, {
  'foo': {
    $container: '#foo',
    'bar': function ($foo) {
      return $foo.find('*').text();
    }
  }
}).done(function(foo){
  console.log(foo);
})
