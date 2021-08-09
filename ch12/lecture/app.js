const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const ColorHash = require('color-hash').default;

dotenv.config();
const connect = require('./schemas');
const webSocket = require('./socket');
const indexRouter = require('./routes');

const app = express();
app.set('port', process.env.PORT || 8005);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
connect();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
// gif.src = '/gif/' + data.gif;
// 프론트 주소가 /gif 이므로
app.use('/gif', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
// 소켓에는 session이 없기 때문에
// 분리 시켜 
// websocket 인자로 세션 미들웨어 전달
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});
app.use(sessionMiddleware);

// 익명 사용자라 해도 식별은 가능해야해서
// 방 안에서는 고유 색 부여
app.use((req, res, next) => {
  if (!req.session.color) {
    const colorHash = new ColorHash();
    // 세션이 끝나기 전까지 고유색 지님
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
});

app.use('/', indexRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// listen을 server 변수로 담을 수있음
// 이걸 통해 웹소켓이랑 연결 시킬거야
const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});

// 둘을 연결하기
webSocket(server, app, sessionMiddleware);