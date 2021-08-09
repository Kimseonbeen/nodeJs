const SocketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });
  // app.set 하면 전역변수로 활용 가능하여
  // req.app.get('io') 해서 데이터 가져올 수있어
  // 라우터랑 소켓 연결 방법이다
  app.set('io', io);
  // 서버 쪽에서도 네임스페이스 구분
  const room = io.of('/room');
  const chat = io.of('/chat');

  // session.color가 안되기 때문에
  // 세션을 넘겨줌
  // cookieParser, sessionMiddleware를 socket.request 적용
  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
  chat.use(wrap(cookieParser(process.env.COOKIE_SECRET)));
  chat.use(wrap(sessionMiddleware));

  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });

  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.request;
    const { headers: { referer } } = req;
    console.log("referer : ", referer);
    const roomId = referer
      .split('/')[referer.split('/').length - 1]
      .replace(/\?.+/, '');
    console.log("roomId : ", roomId);
    socket.join(roomId);
    socket.to(roomId).emit('join', {
      // 시스템 메세지
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다.`,
    });

    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId);
      const currentRoom = socket.adapter.rooms.get(roomId);
      const userCount = currentRoom ? currentRoom.size : 0;
      if (userCount === 0) { // 유저가 0명이면 방 삭제
        // signedCookies 누가 방 지웠는지 알 수 있게
        // 서버에서 서버로 보내면 세션 확인이 안되기 때문
        const signedCookie = cookie.sign(req.signedCookies['connect.sid'], process.env.COOKIE_SECRET);
        const connectSID = `${signedCookie}`;
        axios.delete(`http://localhost:8005/room/${roomId}`, {
          headers : {
            // connect.sid= 할때 s%3A 붙어줘야함
            Cookie : `connect.sid=s%3A${connectSID}`
          }
        })
          .then(() => {
            console.log(`${roomId} 방 제거 성공`);
          })
          .catch(() => {
            console.log(error);
          })
      } else {
        console.log("방 퇴장 !");
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color}님이 퇴장하셨습니다.`,
        });
      }
    });
  });
};