const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  // 성공 시 이동
  passport.serializeUser((user, done) => {
    // done(null, user) 해줘도되는데 이 의미는
    // user 정보 통째로 세션에 저장 비효율적 
    done(null, user.id);    // 세션에 user의 id만 저장
  });

  passport.deserializeUser((id, done) => {
    User.findOne({
       where: { id },
       include : [{
         model : User,
         attributes : ['id', 'nick'],
         as : 'Followers',
         through : 'Follow',
       }, {
         model : User,
         attributes : ['id', 'nick'],
         as : 'Followings',
         through : 'Follow'
       }],
      })
      .then(user => done(null, user))   // req.user, req.isAuthenticated();
      .catch(err => done(err));
  });

  local();
  kakao();
};