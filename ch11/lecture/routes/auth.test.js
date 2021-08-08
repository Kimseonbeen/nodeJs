const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

// 테스트 실행 하기 전에 셋팅
beforeAll(async () => {
    // 테이블들이 생성된 채로 시작 된다.
    // 테이블이 없을경우 생성
    await sequelize.sync();
})

describe('POST /join', () => {
    test('로그인 안 했으면 가입', (done) => {
        request(app)
            .post('/auth/join')
            .send({
                email: 'ksb92422@gmail.com',
                nick: 'zerocho',
                password: '1234'
            })
            // 가입 성공 redirect = location.302
            // expect는 expect(header, value) 또는 
            // expect(statusCode, done)입니다.
            // jest의 expect와 사용법이 다름
            .expect('Location', '/')
            .expect(302, done);
    });
});

describe('POST /login', () => {
    test('로그인 수행', async (done) => {
        // supertest에 app 넣고 .post 하면 요청을 보낸 효과를 낸다
        // 서버는 실행이 안 되지만 라우터는 실행이 된다.
        request(app)
            .post('/auth/login')
            // body 부분
            .send({
                email: 'ksb92422@gmail.com',
                password: '1234'
            })
            .expect('Location', '/')
            // 비동기인 경우에 done 붙임
            .expect(302, done);
    })
})

// describe('POST /join', () => {

// })

// describe('GET /logout', () => {

// })

// 모든 테스트가 끝난 후
afterAll(async () => {
    // force : true 테이블 초기화
    await sequelize.sync({ force: true })
})