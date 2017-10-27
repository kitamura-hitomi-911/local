// fs-read.js
var fs = require('fs');

// test.txtを読み込む
fs.readFile(__dirname + '/test.js', { encoding: 'utf8' }, function(err, data) {
	// ファイルの読み込みが終わったらこのコールバック関数が呼ばれる
	if (err) {
		console.error(err);
	}
	else {
		console.log(data);
	}
});