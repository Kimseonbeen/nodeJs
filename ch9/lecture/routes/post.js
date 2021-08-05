const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {                           //uploads 폴더가 없으면 생성
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

// multer 자체는 미들웨어가 아니고
// 함수를 실행하면 single()등이라는 미들웨어
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
// 이미지 게시글 따로 업로드 하는 이유
// 이미지는 압축 시간이 걸리므로
// 이미지나 동영상은 미리미리 따로 업로드
// 따로 라우터를 두어 게시글 작성 시간동안 이미지 압축 !!
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    // 게시글과 url이 엮이게끔 하는 방식
    res.json({ url: `/img/${req.file.filename}` });
});

//const upload2 = multer();
// upload.none() : 이미지, 동영상 업로드는 이미 했으므로 none() 사용
// bodyparser는 webkitFormboundary를 해석하지 못함 그래서 multer 사용
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        console.log("req.body.content : ",req.body.content);
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        console.log("hashtags: ",hashtags);
        // map은 [#노드, #익스프레스] 이런 배열이 있다면
        // tag.slice(1).toLowerCase() 통해 [노드, 익스프레스] / #을 때줌
        // [findOrCreate(노드), findOrCreate(익스프레스)]
        // [[해시태그, true], [해시태그, true]]
        if (hashtags) {
            // 여러겹 중첩 함수는 안에서 부터 확인해봐라
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() }
                    })
                })
            );
            console.log(result);
            // belongsToMany이니 복수 사용
            await post.addHashtags(result.map(r => r[0]));
        }

        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;