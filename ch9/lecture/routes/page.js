const express = require('express');
const { Post, User, Hashtag } = require('../models');

const router = express.Router();

//모든 라우터에서 공통 부분은 위에서 빼서 밑의 라우터에서 render 보내지 않고 사용할 수 있음 !!
// router.user 하면 get, post, put 라우터 모두 적용 됨
// res.locals 하면 .user로만 템플릿엔진에서 사용가능하다? 맞음
// res.locals 사용하면 전역에서 사용 가능한 변수를 만드는것
router.use((req, res, next) => {
  console.log(" req.user!!!! : ", JSON.stringify(req.user));
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
  console.log("////////////////////////////////////////");
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    console.log("posts!!!!!!!!!!!!!!!!!!!!!!!!!! : ",JSON.stringify(posts));
    console.log("userId : ", JSON.stringify(posts.length));
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
    console.log("hashtag : ", hashtag);
    let posts = [];
    if (hashtag) {
      // include 해줌으로 게시글의 작성자 까지 다 가져와
      // 필요한 애들만 atrributes 해줘서 가져오기
      // belongsToMany므로 hashtag.getPosts 통해 해시태그 게시물 가져오기 
      // 게시물의 데이터 가져오는거
      // findOne 한 객체를 hashtag.getPosts 사용할수있나바
      posts = await hashtag.getPosts({ include: [{ model: User, attributes : ['id', 'nick'] }] });
      console.log("posts : ",posts);
    }
    // 'main' = main.html
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