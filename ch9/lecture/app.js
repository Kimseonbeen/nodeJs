// 초기 설정 시 
// npx sequlize init 해주기
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models');
// passport 연결
const passportConfig = require('./passport');

const app = express();
// 개발 포트, 배포 포트 다르게 사용하기 위함
app.set('port', process.env.PORT || 8001);  //process.env.PORT를 앞에 쓰는 이유는 나중에 배포할때 433 or 80 포트 사용하기 위해
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
// force : true = 테이블을 삭제하고 다시 만듦
// 이럴경우 기존 데이터가 모두 날라감
// alter : true = 노드에서 테이블을 수정하면 그걸 인식하여 mysql 테이블 수정
// alter : true는 에러가 나는 경우가 많음
// force : false 기본적
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  })
passportConfig();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // form-data 보낼 시 해석을 해서 req.body에 넣어준다. //이미지 muitipart 경우에는 불가
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
// 로그인 한 뒤 그 다음 요청 보낼 때
// 미들웨어 두개를 미리 연결
// 얘내 둘은 app.use(session) 보내 밑에 위치 해야한다.
app.use(passport.initialize());
// 로그인 후 그 다음 요청 부터 passport.session() 실행 될 때
// passport.session()이 아이디를 알아내고 passport.deserializeUser(id) 전달
// passport.deserializeUser()이 실행된다.
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 인자 4개
// next 안 쓰더라도 생략 X
app.use((err, req, res, next) => {
  // res.locals = 템플릿 엔진에서 에러 처리 위함
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});