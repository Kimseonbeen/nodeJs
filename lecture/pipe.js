const fs = require('fs');
const zlib = require('zlib');

const readStream = fs.createReadStream('./readme3.txt', {highWaterMark: 16});
const zlibStream = zlib.createGzip(); //압축 스트림
const writeStream = fs.createWriteStream('./writeme4.txt');
readStream.pipe(zlibStream).pipe(writeStream);   //간단하게 보면 파일 복사 ( 파일을 읽고 다시 쓰는 )