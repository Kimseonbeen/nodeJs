const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();


// POST /user/1/follow
// 내가 팔로우 하는거
// 14번이 13을 팔로윙 하는거
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      // model assoicate as 설정이름으로 //setFollowings 수정시  //removeFollwings //remove // get
      //paseInt 두번째 인자는 10진법을 뜻함
      await user.addFollowings([parseInt(req.params.id, 10)]); 
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;