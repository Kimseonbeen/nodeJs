const http = require('http');

//port가 하나의 프로그램
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8'})
    res.write('<h1>Hello Node!</h1>');
    res.write('<p>Hello server</p>');
    res.end('<p>Hello ZeroCho</p>');
})
    .listen(8080);
server.on('listening', () => {
    console.log('8080번 포트에서 서버 대기 중입니다.');
})
server.on('error', (error) => {
    console.error(error);
})