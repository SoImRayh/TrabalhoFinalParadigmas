import  * as jp from 'jsonpath'
export const getPaths = (data: Array<object>): void => {
    const final  =  jp.query(data, '$..quantity')

    const flag = new SharedArrayBuffer(4)
    const array = new SharedArrayBuffer(final.length*4)

    const flagView = new Int8Array(flag)
    const arrayView = new Int32Array(array)


    arrayView.set(final);
    flagView[0]= 1

    let workers = []

    for (let i = 0; i < 50; i++) {
        workers.push(new Worker('src/workers/exhangeWorker.js'))
        workers[i].postMessage({flag, array})
    }





}