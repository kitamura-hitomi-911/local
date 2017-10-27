// array-utils.jsを呼び出す
var arrayUtils = require('./lib/array-utils');

// array-utilsモジュールの機能を利用する
var arr = [1, 20, 5];
console.log('max:', arrayUtils.max(arr));
console.log('min:', arrayUtils.min(arr));