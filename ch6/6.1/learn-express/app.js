const express = require('express');
const path = require('path');
const app = express();

console.log("process.env.PORT : ",process.env.PORT);

// server에 속성을 심는다
app.set('port', process.env.PORT || 3000);  //전역 변수 느낌

app.use((req, res, next) => {         
    console.log('모든 요청에 실행하고 싶어요.');
    // throw new Error("dsadas")
    next();             //미들웨어 같은경우 next를 사용해야 다음걸로 넘어감 // 미들웨어에서 -> app.get('/')
})

app.use((req, res, next) => {
    console.log('미들웨어 1 실행');
    next();
}, (req, res, next) => {
    try {
        console.log("ㅇㄴㅁㅇㅁㄴ");
        next();
    } catch(error) {
        next(error);    //next에 인수 값이 있을경우 에러라 판단하여 밑의 라우터를 거치지 않고 바로 에러처리 미들웨어로 넘겨줌
    }
})

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    
    // 같은 라우터에 미들웨어가 두 개 인경우
    // 같은 라우터의 밑 부분 미들웨어가 실행 되는것이 아니라
    // 다음 라우터 미들웨어가 실행

    // next() 분기 처리
    if( false ) {
        next('route');  
    } else {
        next(); // 트루이면 같은 라우터의 밑 부분 미들웨어가 실행
    }

    // res.writeHead(200, ~~~)
    // res.end()
    // 위의 두 코드가 express 에서
    // res.send()로 사용 가능
}, (req, res) => {
    
    console.log("실행되나요 ?");
});

// 이 부분의 미들웨어가 실행
app.get('/', (req, res) => {
    console.log("실행 됩니다.");
})

// 와일드 카드 /:{name}
app.get('/category/:name', (req, res) => {
    res.send(`hello ${req.params.name}`);
});

// 위에서 아래로 실행 되다 보니 와일드카드 부분이 실행되고 app.get('/category/javascript) 부분 실행 안됌
// 그래서 와일드카드 로직은 밑부분에 작성
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
// })   // 위에서 작성 할 경우 밑의 라우터는 실행 조차 되지 않는다.

// 404 처리 미들웨어
// 라우터들 밑, 에러처리 미들웨어 보단 위에 작성하면 404처리 미들웨어
app.use((req, res, next) => {
    res.status(404).send('404 ~');
})

//맨 밑에 에러 미들웨어 작성    //에러 미들웨어 경우 반드시 매개변수 4개 필수
app.use((err, req, res, next) => {
    console.error(err);
    // 500번때는 조심해서 사용 해야됨 해커들이 번호로 무슨 오류인지 추측가능
    // 400번때로 퉁 치는 경우도 많음
    res.status(200).send('에러가 났습니다 ...ㅠ');
})

app.listen(app.get('port'), () => {     //3000
    console.log('익스프레스 서버 실행');
});