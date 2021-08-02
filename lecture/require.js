require('./var');   //다른 파일을 실행만 하고 싶을때 가능
// require 처음 불러올때는 지정한 파일을 읽지만 그 후론 cache에 저장된걸 불러온다 
// 그래서 속도가 빨라 효율적임
console.log(require);


// 만약
// node 코드 수정시 수정될걸 볼려면 node를 껐다 켜야 하는데
// cache를 적절히 이용하면 껐다 켰다 안 할수 있다 nodemon?