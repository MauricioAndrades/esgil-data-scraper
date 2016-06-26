


var urlList = ["url1", "url2", "url3"];
Promise.map(urlList, function(url) {
    return request.getAsync(url).spread(function(response.body) {
        return JSON.parse(body);
    });
}).then(function(results) {
     // results is an array of all the parsed bodies in order
}).catch(function(err) {
     // handle error here
});