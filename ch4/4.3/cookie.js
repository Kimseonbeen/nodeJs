const http = require('http');

http.createServer((req, res) => {
  console.log(req.url, req.headers.cookie);
  res.writeHead(200, { 'Set-Cookie': 'mycookie=test' });
  res.end('Hello Cookie');
})
  .listen(8083, () => {
    console.log('8083번 포트에서 서버 대기 중입니다!');
  });

  // favicon.ico는 크롬 확장프로그램에서 자동으로 보내주는거
  // 처음 브라우저에 요청 했을때 쿠키를 보내준다.
  // 브라우저를 종료 할시 쿠키 사라짐