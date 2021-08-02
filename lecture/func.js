const {odd, even} = require('./var');    // 구조분해 할당

function checkOddOrEven(number) {
    if(number % 2) {
        return odd;
    } else {
        return even;
    }
}

//module.exports는 파일에 단 한번만 사용
module.exports =  checkOddOrEven
