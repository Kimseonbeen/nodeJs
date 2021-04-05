const {Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const min = 2;
let primese = [];

function findPrimes(start, range) {
    let isPrime = true;
    const end = start + range;
    for(let i = start; i < end; i++) {
        for(let j = min; j < Math.sqrt(end); j++) {
            if(i !== j && i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if(isPrime) {
            primese.push(i);
        }
        isPrime = true;
    }
}

if(isMainThread) {
    const max = 10_000_000;
    const threadCount = 16;
    const threads = new Set();
    const range = Math.ceil((max - min) / threadCount);
    let start = min;
    console.time('prime');
    for(let i = 0; i < threadCount - 1; i++) {
        const wStart = start;
        threads.add(new Worker(__filename, {workerData : { start : wStart, range}}));
    }
    threads.add(new Worker(__filename, {workerData: {start, range: range + ((max - min +1) % threadCount) }}));
    for ( let worker of threads) {
        worker.on('error', (err) => {
            throw err;
        })
        worker.on('exit', () => {
            threads.delete(worker);
            if(threads.size === 0) {
                console.timeEnd('prime');
                console.log(primese.length);
            }
        });
        worker.on('message', (msg) => {
            primese = primese.concat(msg);
        });
    }
} else {
    findPrimes(workerData.start, workerData.range);
    parentPort.postMessage(primese);
}