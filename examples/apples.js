CloudTypes = require('../server/Server');


var server = CloudTypes.Server;

var groceries = new CloudTypes.Index([{name: 'string'}], {toBuy: 'CInt', country: 'CString'});
server.declare('groceries', groceries);

var apples = groceries.get('apples');


// CloudType operations with CloudInteger.
// ---------------------------------------
// var toBuy = apples.get('toBuy');

// toBuy.printFields();
// console.log('amount of apples to buy = ' + toBuy.get());

// console.log('set amount to 5 apples...');
// toBuy.set(5);
// console.log('amount of apples to buy = ' + toBuy.get());

// toBuy.printFields();
// console.log('add 3 apples to the amount...');
// toBuy.add(3);
// console.log('amount of apples to buy = ' + toBuy.get());

// console.log('buying 8 apples...');
// toBuy.add(-8);
// console.log('amount of apples to buy = ' + toBuy.get());
// toBuy.printFields();


// CloudType operations with CloudString.
// ---------------------------------------
// var country = apples.get('country');

// country.printFields();
// console.log('country of the apples = ' + country.get());

// console.log('setting the country to \'Belgium\'...');
// country.set('Belgium');
// console.log('country of the apples = ' + country.get());

// country.printFields();
// console.log('erasing the country...');
// country.set('');
// console.log('country of the apples = ' + country.get());

// console.log('setting the country to \'France\'...(setIfEmpty)');
// country.setIfEmpty('France');
// console.log('country of the apples = ' + country.get());

// console.log('setting the country to \'Berlin\'...(setIfEmpty)');
// country.setIfEmpty('Berlin');
// console.log('country of the apples = ' + country.get());

// console.log('erasing the country...');
// country.set('');
// console.log('country of the apples = ' + country.get());
// country.printFields();