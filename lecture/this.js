console.log(this);  //global? // {} 리턴
// this는 전역 객체를 가르킴
// 전역 스코프에서는 global이 아님
console.log(this === module.exports);

function a() {
    console.log(this === global);
    // fuction 안에 this는 global
}
a();