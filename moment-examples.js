var moment = require('moment');
var now = moment().utcOffset("-05:00");;

// console.log(now.format());
// console.log(now.format('X'));
// console.log(now.valueOf('x'));

var timestamp = 1472169082530;
var timestampMoment = moment.utc(timestamp).utcOffset("-05:00");

console.log(timestampMoment.format('h:mm a'));

// now.subtract(5, 'year');

// console.log(now.format());
// console.log(now.format('MMM Do YYYY, h:mm a'));