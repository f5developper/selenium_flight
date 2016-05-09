var date = require('../modules/date');

console.log(date.getDay());
console.log(date.getDay('2017'));
console.log(date.getDay('','8'));
console.log(date.getDay('','','10'));
console.log(date.getDay('','3',''));


var day = date.getDay();
console.log(date.getFirstOfTheMonth(date.getDay('','1')));
console.log(date.getFirstOfTheMonth(date.getDay('','2')));
console.log(date.getFirstOfTheMonth(date.getDay('','3')));
console.log(date.getFirstOfTheMonth(date.getDay('','4')));
console.log(date.getFirstOfTheMonth(date.getDay('','5')));
console.log(date.getFirstOfTheMonth(date.getDay('','6')));
console.log(date.getFirstOfTheMonth(date.getDay('','7')));
console.log(date.getFirstOfTheMonth(date.getDay('','8')));
console.log(date.getFirstOfTheMonth(date.getDay('','9')));
console.log(date.getFirstOfTheMonth(date.getDay('','10')));
console.log(date.getFirstOfTheMonth(date.getDay('','11')));
console.log(date.getFirstOfTheMonth(date.getDay('','12')));

console.log(date.getEndOfTheMonth(date.getDay('','1')));
console.log(date.getEndOfTheMonth(date.getDay('','2')));
console.log(date.getEndOfTheMonth(date.getDay('','3')));
console.log(date.getEndOfTheMonth(date.getDay('','4')));
console.log(date.getEndOfTheMonth(date.getDay('','5')));
console.log(date.getEndOfTheMonth(date.getDay('','6')));
console.log(date.getEndOfTheMonth(date.getDay('','7')));
console.log(date.getEndOfTheMonth(date.getDay('','8')));
console.log(date.getEndOfTheMonth(date.getDay('','9')));
console.log(date.getEndOfTheMonth(date.getDay('','10')));
console.log(date.getEndOfTheMonth(date.getDay('','11')));
console.log(date.getEndOfTheMonth(date.getDay('','12')));


var day = date.getDay('','8');
console.log(date.getFirstOfTheMonth(day));
console.log(date.getEndOfTheMonth(day));


var start = date.getDay('','','1');
var end = date.getFirstOfTheMonth(start);

console.log('s : ' + start);
console.log('e : ' + end);

if(start == end){
    console.log('true');
}else{
    console.log('false');
}

var start = date.getDay('','','30');
var end = date.getEndOfTheMonth(start);

console.log('s : ' + start);
console.log('e : ' + end);


if(start == end){
    console.log('true');
}else{
    console.log('false');
}
