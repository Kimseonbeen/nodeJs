const express = require('express');
const path = require('path');
const app = express();

console.log("process.env.PORT : ",process.env.PORT);
app.set('port', process.env.PORT || 3000);  //전역 변수 느낌

app.use((req, res, next) => {         //about에만 실행되게 하고 싶을경우
    console.log('모든 요청에 실행하고 싶어요.');
    next();             //미들웨어 같은경우 next를 사용해야 다음걸로 넘어감
})

app.use((req, res, next) => {
    console.log('미들웨어 1 실행');
    next();
}, (req, res, next) => {
    try {
        console.log(qeqweweww);
    } catch(error) {
        next(error);    //next에 인수 값이 있을경우 에러라 판단하여 에러처리 미들웨어로 넘겨줌
    }
})

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/category/:name', (req, res) => {
    res.send(`hello ${req.params.name}`);
});

app.get('/category/Javascript', (req, res) => {
    res.send('hello Javascript');
});

app.post('/', (req,res) => {
    res.send('hello express!');
})


app.get('/about', (req,res) => {
    res.send('hello express');
})

// app.get('*', ( req ,res )=> {
//     res.send('hello all');      //범위가 큰 라우터 일경우 밑에다 작성
// })

//404 처리 미들웨어
app.use((req, res, next) => {
    res.status(404).send('404 ~');
})

//맨 밑에 에러 미들웨어 작성    //에러 미들웨어 경우 반드시 매개변수 4개 필수
app.use((err, req, res, next) => {
    console.error(err);
    res.send('에러가 났습니다 ...ㅠ');
})

app.listen(app.get('port'), () => {     //3000
    console.log('익스프레스 서버 실행');
});