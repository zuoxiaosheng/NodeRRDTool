var config  = require('../config').config;
var fs      = require('fs');

exports.list = function(req, res) {
	var files = fs.readdirSync(config.rrdPath);
	res.render('list',{files:files});
}