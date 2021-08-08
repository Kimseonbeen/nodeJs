const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

// if문을 분기점으로 보기
// 같은 테스트 인경우 describe로 그룹화 가능
describe('isLoggendIn', () => {
    // jest.fn() => 가짜 함수 만들기
    // 이런 가짜 함수 만드는것을 모킹이라고 부름
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();
    test('로그인되어 있으면 isLoggendIn이 next를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        isLoggedIn(req, res, next); // 먼저 한번 실행 한 뒤
        // 실행 뒤 한 번 호출 되었는가를 확인 하는거 1번 호출 되었다면 if문 true의 next() 호출 되었다는 것을 의미
        expect(next).toBeCalledTimes(1);    // toBeCalledTimes : 몇 번 호출 되었는지 확인
    });
    
    test('로그인되어 있지 않으면 isLoggendIn이 에러를 응답해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),  // 이때는 false 
        };
        isLoggedIn(req, res, next);
        // 하나의 테스트안에서 expect 모두 만족해야 테스트 성공
        expect(res.status).toBeCalledWith(403); // status는 403으로 호출 되어야 하고
        expect(res.send).toBeCalledWith('로그인 필요'); // send는 로그인 필요로 호출되어야함
    });
});
describe('isNotLoggedIn', () => {
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
        redirect: jest.fn(),
    };
    const next = jest.fn();
    test('로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        const message = encodeURIComponent('로그인한 상태입니다.');
        isNotLoggedIn(req, res, next);
        expect(res.redirect).toBeCalledWith(`/?error=${message}`)
    })
    
    test('로그인되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    })
})