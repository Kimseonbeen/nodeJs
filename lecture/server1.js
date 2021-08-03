const http = require('http');

//port가 하나의 프로그램
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8'})
    res.write('<h1>Hello Node!</h1>');
    res.write('<p>Hello server</p>');
    res.end('<p>End Node!</p>');
})
    // 서버를 작동 시킬 경우 터미널 하나를 잡아먹는다.
    // https 경우 :433 생략가능
    // http 경우 :80 생략가능
    // 포트하나가 하나의 프로그램
    .listen(8080);  // 프로세스로 올려야한다
server.on('listening', () => {
    console.log('8080번 포트에서 서버 대기 중입니다.');
})
server.on('error', (error) => {
    console.error(error);
})