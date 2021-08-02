const odd = '홀수입니다.';
const even = '짝수압니다.';


// 변수를 선언한것을 다른 파일에 사용가능
// 여러개를 넣을땐 exprots.객체명
// 한개를 넣을땐 modules.export
exports.odd = odd;
exports.even = even;

// this.odd = odd 이것도 가능한데 헷갈리므로 사용하지 않는다.

// 객체를 module.exports 대입해준거 
// module.exports = { odd, even}

// module.exports === exports === {}


// exports.odd = odd 와 module.exports는 같이 사용 할 수없다. 