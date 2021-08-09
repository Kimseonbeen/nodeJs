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
// describe('POST /login') 분리 처리한 이유
// 첫 번째 로직엔 beforeEach를 적용하고 싶지만
// 두 번째 로직엔 beforeEach를 적용하고 싶지 않아서
// 로그인 상태로 테스트 임함
describe('POST /login', () => {
    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'ksb92422@gmail.com',
                password: '1234',
            })
            .end(done);
    });

    test('이미 로그인했으면 redirect /', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent
            .post('/auth/join')
            .send({
                email: 'ksb92422@gmail.com',
                nick: 'zerocho',
                password: '1234',
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done);
    });
});

describe('POST /login', () => {
    test('가입되지 않은 회원', async (done) => {
        const message = encodeURIComponent('가입되지 않은 회원입니다.');
        request(app)
            .post('/auth/login')
            .send({
                email: 'ksb9241@gmail.com',
                password: '1234',
            })
            .expect('Location', `/?loginError=${message}`)
            .expect(302, done);
    });

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
    });

    test('비밀번호 틀림', async (done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        request(app)
          .post('/auth/login')
          .send({
            email: 'ksb92422@gmail.com',
            password: 'wrong',
          })
          .expect('Location', `/?loginError=${message}`)
          .expect(302, done);
      });
});

// describe('POST /join', () => {

// })

describe('GET /logout', () => {
    test('로그인이 되어있지 않으면 403', async (done) => {
        request(app)
            .get('/auth/logout')
            .expect(403, done);
    });

    const agent = request.agent(app);
    // beforeEach = 테스트하기 직전에 실행되는거
    // 모든 테스트마다 그 전에 실행 되는거
    // 밑의 test가 여러개면 테스트 실행 시 마다 beforeEach 실행
    beforeEach((done) => {
        // agent = 상태를 유지한다
        // 만약 로그인을 하고 로그인 상태에서 다른 테스트도 가능
        agent
            .post('/auth/login')
            .send({
                email: 'ksb92422@gmail.com',
                password: '1234'
            })
            .end(done);
    });

    test('로그아웃 수행', async (done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        agent
            .get('/auth/logout')
            .expect('Location', '/')
            .expect(302, done);
    })
})

// 모든 테스트가 끝난 후
afterAll(async () => {
    // force : true 테이블 초기화
    await sequelize.sync({ force: true })
})