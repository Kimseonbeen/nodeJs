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
    // hash 인자의 숫자가 더 높을 수록 더 복잡하게 해쉬화함
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

// 미들웨어 확장법 사용
// isNotLoggedIn 미들웨어 없다는 전제 하
// 1. /login 요청이 들어왔을 때
// 2. passport.authenticate('local')이 실행된다.
// 3. passport가 local을 찾아 localstrategy 이동 (index.js에 등록)
// 4. localstrategy가 실행됨
// 5. done() 호출 되어 (authError, user, info) 실행 done이란 인자값 메칭
// 6. 성공 시 req.login() 실행 req.login() => index.js serializeUser이동
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
      // 성공 시 로직
      // 세션 쿠키를 브라우저로 보내준다.
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  // req.logout() : 세션 쿠키가 사라짐
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