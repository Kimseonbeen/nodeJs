exports.isLoggedIn = (req, res, next) => {
    // req.isAuthenticated()면 로그인 되어있는 상태
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).send('로그인 필요');
      // next()가 없으니 여기서 끝남
    }
  };
  
  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      const message = encodeURIComponent('로그인한 상태입니다.');
      res.redirect(`/?error=${message}`);
    }
  };