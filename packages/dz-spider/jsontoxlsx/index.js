var fs = require('fs')
var json2xlsx = require('json2xls');


var data = []

var xlsx = json2xlsx(data);

fs.writeFileSync('city190530.xlsx', xlsx, 'binary');