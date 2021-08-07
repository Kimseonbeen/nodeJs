const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');
const router = express.Router();

// cors
// 두 도메인이 다른경우에 브라우저에서 서버로 요청을 보낼시 나는 오류
// 다른 방법으로는 proxy서버를 둬서 중간 다리 역할을 하게 한다.


router.use(async (req, res, next) => {     // 미들웨어 확장 패턴
  console.log("dasdasdasds");
  const domain = await Domain.findOne({
    where : { host: url.parse(req.get('origin'))?.host }  // nodecat에 orgin 설정부분 :4000 // ?. = undefinded 가 아니면 객체에서 host를 가져오는 연산자
  });
  console.log("domain : ", domain);
  if(domain) {
    console.log("if else");
    cors({    //미들웨어 확장 패턴 = 검사를 할 수 있다.
      origin: true,
      credentials: true,
    })(req, res, next);
  } else {
    next();
  }
});

router.post('/token', apiLimiter, async (req, res) => {
  console.log("token !");
  const { clientSecret } = req.body;
  console.log("clientSecret : ",clientSecret);
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ['nick', 'id'],
      },
    });
    console.log("domain : ",JSON.stringify(domain));
    console.log("domain : ",JSON.stringify(domain.User));
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }
    const token = jwt.sign({
      id: domain.User.id,
      nick: domain.User.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: '1m', // 1분
      issuer: 'nodebird',
    });
    // cors 오류 해결 방법
    // 하지만 이렇게 만들 시 활용성이 떨어진다.
    //res.setHeader('Access-Control-Allow-Origin', 'localhost:4000');
    //res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

router.get('/test', verifyToken, apiLimiter, (req, res) => {
  res.json(req.decoded);
});

router.get('/posts/my', verifyToken, apiLimiter, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (req, res) => {
  console.log("wwwwwww");
  console.log("wwwwwww");
  console.log("wwwwwww");
  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: '검색 결과가 없습니다',
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

module.exports = router;