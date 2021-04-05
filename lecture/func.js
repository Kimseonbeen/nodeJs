const {odd, even} = require('./var');

function checkOddOrEven(number) {
    if(number % 2) {
        return odd;
    } else {
        return even;
    }
}

//파일에 단 한번만 사용
module.exports =  checkOddOrEven
