const SocketIO = require('socket.io');

module.exports = (server, app) => {
  const io = SocketIO(server, { path: '/socket.io' });
  app.set('io', io);
  io.on('connection', (socket) => { // 웹 소켓 연결 시
    const req = socket.request;
    const { headers: { referer } } = req;
    // roomId는 Good 테이블의 로우 id가 됩니다.
    const roomId = referer.split('/')[referer.split('/').length - 1];
    socket.join(roomId);
    socket.on('disconnect', () => {
      socket.leave(roomId);
    });
  });
};