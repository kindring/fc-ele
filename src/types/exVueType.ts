// import vue from 'vue'; // eslint-disable-line no-unused-vars
import {IpcAction} from "../tools/IpcCmd.ts";

declare module '@vue/runtime-core' {
    // 扩展全局变量的接口内容，需要扩展ComponentCustomProperties这个接口，不要乱改成别的

    interface ComponentCustomProperties {
        $winHandle: (action: IpcAction) => void,
    }
}
