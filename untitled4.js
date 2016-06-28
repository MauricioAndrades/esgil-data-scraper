return getProlificHomepage().then(function (html) {
  return htmlToJson.batch(html, {
    sections: htmlToJson.createParser(['#primary-nav a', {
      'name': function ($section) {
        return $section.text();
      },
      'link': function ($section) {
        return $section.attr('href');
      }
    }]),
    offices: htmlToJson.createMethod(['.office', {
      'location': function ($office) {
        return $office.find('.location').text();
      },
      'phone': function ($office) {
        return $office.find('.phone').text();
      }
    }]),
    socialInfo: ['#footer .social-link', {
      'name': function ($link) {
        return $link.text();
      },
      'link': function ($link) {
        return $link.attr('href');
      }
    }]
  });
});