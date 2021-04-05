const {odd, even} = require('./var');
const checkNumber = require('./func');

//console.time('seonbin');
function checkStringOddOrEven(str) {
    if (str.length % 2) {
        return odd;
    } else {
        return even;
    }
}
//console.timeEnd('전체시간');

console.log(checkNumber(10));
console.log(checkStringOddOrEven('hello'));