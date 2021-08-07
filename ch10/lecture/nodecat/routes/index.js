const express = require('express');
const axios = require('axios');

const router = express.Router();

const URL = 'http://localhost:8002/v2';

axios.defaults.headers.origin = 'http://localhost:4000'; // origin 헤더 추가

// 요청을 보내는 함수
const request = async (req, api) => {
  try {
    if (!req.session.jwt) { // 세션에 토큰이 없으면
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
    }
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    }); // API 요청
  } catch (error) {
    if (error.response.status === 419) { // 토큰 만료시 토큰 재발급 받기
      delete req.session.jwt;
      return request(req, api);
    } // 419 외의 다른 에러면
    return error.response;
  }
};

router.get('/mypost', async (req, res, next) => {
    try {
      // 요청을 보낼 땐 await request : 서버에서 서버로
      const result = await request(req, '/posts/my');
      res.json(result.data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
  router.get('/search/:hashtag', async (req, res, next) => {
    console.log("dsadaddadas");
    try {
      const result = await request(
        req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
      );
      res.json(result.data);
    } catch (error) {
      if (error.code) {
        console.error(error);
        next(error);
      }
    }
  });

  router.get('/', (req, res) => {
    // 사실 시크릿키는 뷰에 보내지면 안되므로
    // restapikey와 javascript 키를 분리하여 둘 다 제공해주어야함
    res.render('main', { key: process.env.CLIENT_SECRET })
  })

  // cors error
  // cors 에러는 브라우저에서 서버로 요청을 보낼 때만 에러가 발생
  // 브라우저에서 서버로 요청을 보냈는데 도메인이 다를 때
  // 포트가 달라도 cors 에러남

module.exports = router;