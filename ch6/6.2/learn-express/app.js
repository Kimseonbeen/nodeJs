const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
//const multer = require('multer');
const path = require('path');
const app = express();

dotenv.config();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev')); //combined 배포 시에
//app.use('요청 경로', express.static('실제경로'))
//localhost:3000/zerocho.html       learn-express/public/zerocho.html
app.use(express.static(path.join(__dirname, 'public'))) //정적 파일 보내주는거  //내부적으로 next() X // 파일 주면 끝
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

const multer = require('multer');
const fs = require('fs');

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'multipart.html'));
});
app.post('/upload', upload.single('image'), (req, res) => {   // 파일이 여러개 일 시 upload.array 
  console.log(req.file);
  res.send('ok');
});

// 미들웨어 확장법
app.use('/', (req, res, next) => {
  if('조건') {
    express.static(path.join(__dirname, 'public'))(req, res, next)
  }else {
    next();
  }
})
app.use(express.json());  //json parsing
app.use(express.urlencoded({ extended : true}));  //form parsing  //true qs, false queryString

app.get('/', (req, res, next) => {
  req.session.id = 'hello';
  res.send('test');
  console.log('GET / 요청에서만 실행됩니다.');
})
// , (req, res) => {
//   throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
// });
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});