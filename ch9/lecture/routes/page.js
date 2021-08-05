const express = require('express');
const { Post, User, Hashtag } = require('../models');

const router = express.Router();

//모든 라우터에서 공통 부분은 위에서 빼서 밑의 라우터에서 render 보내지 않고 사용할 수 있음 !!
// router.user 하면 get, post, put 라우터 모두 적용 됨
// res.locals 하면 .user로만 템플릿엔진에서 사용가능하다?
router.use((req, res, next) => {
  res.locals.user = req.user;         
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followingIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});

router.get('/profile', (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    console.log("posts : ",JSON.stringify(posts));
    res.render('main', {
      title: 'NodeBird',
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
  //GET /hashtag?hashtag=노드
router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User, attributes : ['id', 'nick'] }] });
    }

    return res.render('main', {
      title: `#${query} 검색 결과 | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;