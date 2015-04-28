Index = require('./shared/Index');


//[{name: 'string'}, {amount: 'number'}]
index = new Index([{name: 'string'}, {year: 'number'}], {amount: 'CInt', price : 'CInt', country : 'CString'})
entry = index.get('apples', 1993);

console.log(entry.key('name'));

cloudtype = entry.get('country');

console.log(cloudtype);