const fs = require('fs');

fs.readFile('./readme.txt', (err, data) => {
    if(err) {
        throw err;
    }
    console.log('1번', data.toString());
})

fs.readFile('./readme.txt', (err, data) => {
    if(err) {
        throw err;
    }
    console.log('2번', data.toString());
})

fs.readFile('./readme.txt', (err, data) => {
    if(err) {
        throw err;
    }
    console.log('3번', data.toString());
})

fs.readFile('./readme.txt', (err, data) => {
    if(err) {
        throw err;
    }
    console.log('4번', data.toString());
})

// 비동기 함수이므로 모두 백그라운드로 이동해 동시에 실행된다.
// 그래서 누가 먼저 실행될지 모름 (운영체제만 앎)