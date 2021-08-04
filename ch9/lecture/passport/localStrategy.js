const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

// done() ?
// done (서버에러, 로그인이 성공한 경우, 로그인 실패시 메세지)
// done 함수를 호출 시 다시 auth.js /login 돌아와 
// 'local' 다음 부분 실행 (authError, user, info) ~
module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email', // req.body.email
    passwordField: 'password',  //req.body.password
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } });
      // 이메일이 존재 하면
      if (exUser) {
        // bcrypt.compare로 비밀번호 비교
        const result = await bcrypt.compare(password, exUser.password);
        if (result) {
          done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};