export type ResType<T> = T | null | undefined
export type handleResult<T> = [Error | null | any, ResType<T>]
export type PromiseResult<T> = Promise<handleResult<T>>
export function handle<T>(promise: Promise<T>): PromiseResult<T> {
    return new Promise<[Error | T | null , T | null | undefined]>(resolve => {
        promise.then(val => {
            resolve([null, val]);
        }).catch((err: Error )=> {
            resolve([err, null]);
        });
    });
}
