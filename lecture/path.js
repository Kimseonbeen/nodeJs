const path = require('path');


path.join(__dirname, 'var.js');
// path를쓰게되면 운영체제와 상관없이 경로를 합쳐줌
// WINDOW: \nodejs-book\lecture\var.js
// MAC : /nodejs-book/lecture/var.js

console.log(path.join(__dirname,'..', '/var.js'));   //join은 절대경로 무시
console.log(path.resolve(__dirname, '..', '/var.js'));  //resolve는 절대경로 말고 __dirname, '..' 를 무시한다