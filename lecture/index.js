const {odd, even} = require('./var');
// 모듈과 이름이 다르더라도 변수명이기때문에 자유롭게 정하기 가능
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