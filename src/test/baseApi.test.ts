import { ApiController } from '@/apis/baseApi.ts';
import {ApiType, ErrorCode, NotifyData, RequestData, ResponseData} from "@/types/apiTypes.ts";

let listenFn: (event:any , data: ResponseData<any> | NotifyData) => void = () => {}
function sendFn(action: string, params: RequestData){
    // 随机延迟
    // console.log(`sendFn`)
    // 延迟4秒
    setTimeout(() => {
        listenFn(action, {
            type: ApiType.res,
            code: ErrorCode.success,
            callId: params.callId,
            msg: 'success',
            action: action,
            data: params.data
        })
    }, 4000)
}


describe('ApiController', () => {
    const sendActionKey = 'testSendKey';
    const listenerActionKey = 'testListenerKey';
    let apiController: ApiController;

    beforeEach(() => {
        apiController = new ApiController();
        // 初始化发送以及监听函数
        apiController.init('testSign', sendFn, (_action: string, callback: (event:any , data: ResponseData<any> | NotifyData) => void) => {
            // console.log(`callback init listen ${action}`)
            listenFn = callback
        }, sendActionKey, listenerActionKey);
        apiController.setLogFn(console.log);
    });

    afterEach(() => {
        apiController.destroy();
    });

    it('should send a query and receive a response', async () => {
        const params = { key: 'value' };
        const timeout = 5000;

        const [_callId, responsePromise] = apiController.sendQuery(sendActionKey, params, timeout);
        const response = await responsePromise;
        console.log(response)
        expect(response).toBeDefined();
        expect(response.type).toBe(ApiType.res);
        expect(response.action).toBe(sendActionKey);
        expect(response.data).toEqual(params);
        expect(response.code).toBe(ErrorCode.success)
        expect(response.msg).toBe('success')
    });

    it('should register a notify handler and receive a notification', (done) => {
        const action = 'testNotifyAction';
        const params = { key: 'value' };

        const notifyCallback = (data: NotifyData) => {
            expect(data).toBeDefined();
            expect(data.type).toBe(ApiType.notify);
            expect(data.action).toBe(action);
            expect(data.data).toEqual(params);
            expect(data.code).toBe(ErrorCode.success);
            expect(data.msg).toBe('is notify')
            done();
        };

       apiController.registerNotify(action, false, notifyCallback);

       listenFn(action, {
           type: ApiType.notify,
           action: action,
           code: ErrorCode.success,
           msg: 'is notify',
           data: params
       })

    }, 10000);

    it('should cancel a query ', async () => {
        const params = { key: 'value' };
        const timeout = 5000;

        const [callId, responsePromise] = apiController.sendQuery(sendActionKey, params, timeout);

        expect(apiController.calls[callId]).toBeDefined();

        apiController.cancelQuery(callId);
        expect(apiController.calls[callId]).toBeUndefined();

        const response = await responsePromise;




        expect(response.type).toBe(ApiType.res)
        expect(response.action).toBe(sendActionKey)
        expect(response.code).toBe(ErrorCode.cancel)
    });

    it('should change the sign', () => {
        const newSign = 'newSign';

        apiController.changeSign(newSign);

        expect(apiController.signId).toBe(newSign);
    });

    it('should set a log function', () => {
        const logFn = jest.fn();

        apiController.setLogFn(logFn);

        expect(apiController.logFn).toBe(logFn);
    });


});
