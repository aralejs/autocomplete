http =require('http')
url = require('url')
o = {
	a: {
		"a":[
		"abc",
		"abd",
		"abe"
	]},
	b: [
		"bcd",
		"bce"
	],
	c: [
		"cde",
		"cdf"
	]
}
http.createServer(function (req, res) { 
	var q = url.parse(req.url).query, a = {};
	if (q) {
		console.log(q)
		var t = q.split('&');
		if (t && t.length) {
			for (var i in t) {
				var p = t[i].split('=');
				a[p[0]] = p[1];
			}
			console.log(a)
		}
	}
	
	setTimeout(function() {
		res.writeHead('200', {'Content-Type': 'application/json'});
		res.end(a['callback'] + '(' + JSON.stringify(o[a['t']]) + ')');	
	},1000);

}).listen(3000)