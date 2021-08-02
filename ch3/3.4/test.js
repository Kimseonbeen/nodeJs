// 구조분해 문법

// 객체 구조분해
const example = { a: 123, b: {c: 145, d:12345}}

const {a, b:{d}} = example;

console.log("a : ", a);
console.log("d : ", d);

// 배열 구조분해
arr = [1, 2, 3, 4, 5];

const [x, y, , , z] = arr;

console.log("x : ", x);
console.log("y : ", y);
console.log("z : ", z);