const { addFollowing } = require("./user");
jest.mock('../models/user');    // DB까지 가짜로 만드는거 모델 위에 작성
const User = require('../models/user'); // 모킹 하고 싶은 대상

describe('addFollwing', () => {
    const req = {
        user: { id: 1 },
        params: { id: 2 },
    };
    const res = {
        status: jest.fn(() => res),     //  체이닝 하기 위함
        send: jest.fn(),
    };
    const next = jest.fn();
    test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
        // 모킹을 하게되면 findOne한 값이 무조건 resolve안에 있는 객체가 된다. !!!!!
        // 무조건 id : 1 , name : 'zerocho'가 나오는것임
        // Promise.resolve한거는 User.findOne이 원래 프로미스를 리턴하기 때문
        User.findOne.mockReturnValue(Promise.resolve({
            id: 1, name: 'zerocho', 
            addFollowings(value) {
                return Promise.resolve(true);
            }
        }));
        await addFollowing(req, res, next);     //  async 비동기 함수라 앞에 await 붙여줘야함!!!!!!!!!!!
        expect(res.send).toBeCalledWith('success');
    });
    test('사용자를 못 찾으면 res.status(404).send(no user) 호출함', async () => {
        User.findOne.mockReturnValue(Promise.resolve(null));
        await addFollowing(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    });
    test('DB에서 에러가 발생하면 next(error) 호출함', async () => {
        const error = '테스트용 에러';
        // Promise.reject 하면 try catch에서 catch로 넘어감
        // 강제로 catch로 넘기는거
        User.findOne.mockReturnValue(Promise.reject(error));
        await addFollowing(req, res, next);
        expect(next).toBeCalledWith(error);

    });
});