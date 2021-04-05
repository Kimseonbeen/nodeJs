require('./var');   //다른 파일을 실행만 하고 싶을때 가능
//require 처음 불러올때는 지정한 파일을 읽지만 그 후론 cache에 저장된걸 불러온다 그래서 효율
console.log(require);