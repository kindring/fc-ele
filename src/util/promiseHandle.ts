// 将promise 转为
export function handle<T>(promise: Promise<T>): Promise<[Error | null | T, T | null | undefined]> {
    return new Promise<[Error | T | null , T | null | undefined]>(resolve => {
        promise.then(val => {
            resolve([null, val]);
        }).catch((err: Error )=> {
            resolve([err, null]);
        });
    });
}
