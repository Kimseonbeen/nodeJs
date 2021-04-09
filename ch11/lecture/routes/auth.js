const express = require('express');
 const passport = require('passport');
 const bcrypt = require('bcrypt');
 const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {    // index.js 이동    // req.login serializeUser 실행되도록 등록되어 있는 상태
      if (loginError) {                         // serializeUser done 되는 순간 이동
        console.error(loginError);
        return next(loginError);
      }
      // 세션 쿠키를 브라우저로 보내준다.
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao')); // 1. 실행되면 kakaoStrategy 이동

router.get('/kakao/callback', passport.authenticate('kakao', {  // 2. 카카오 사이트에서 로그인 후 strategy 이동
  failureRedirect: '/', // 3. kakoStrategy 실패 후 이동 로직
}), (req, res) => {     // 3. kakoStrategy 성공 후 이동 로직
  res.redirect('/');
});

module.exports = router;