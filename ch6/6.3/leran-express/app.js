const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//const multer = require('multer');
const path = require('path');
const app = express();

dotenv.config();
const indexRouter = require('./routers');
const userRouter = require('./routers/user');
app.set('port', process.env.PORT || 3000);

// pug 사용
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev')); //combined 배포 시에
//app.use('요청 경로', express.static('실제경로'))
//localhost:3000/zerocho.html       learn-express/public/zerocho.html
app.use(express.static(path.join(__dirname, 'public'))) //정적 파일 보내주는거  //내부적으로 next() X // 파일 주면 끝
app.use(express.json());  //json parsing
app.use(express.urlencoded({ extended : true}));  //form parsing  //true qs, false queryString
// 미들웨어간 순서도 중요
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave : false,
  saveUninitialized : false,
  secret : process.env.COOKIE_SECRET,
  cookie : {
    httpOnly : true,
  },
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

// 404 처리 미들웨어
app.use((req, res, next) => {
  res.status(404).send('Not Found');
})

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});