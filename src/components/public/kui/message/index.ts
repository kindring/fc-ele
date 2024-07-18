import MessageManager from "./instance.ts";
import _message from "./kui-message-list.vue";
import {MessageConfig, MessageFn, NotifyType} from "@/types/BaseTypes.ts";
import {isNumber, isString} from "@/util/util.ts";
import {App, AppContext} from "vue";

let msg: MessageManager | null = null;
const types = ["log", "info", "success", "warning", "warn", "error", "loading"] as const;


const _msgName = _message.name ?? "kui-message-list";
const message = types.reduce((pre, val) => {
    pre[val] = (config: string | MessageConfig, appContext?: AppContext | number) => {
        let duration = 2000;
        if (isString(config)) {
            config = { content: config as string };
        }
        if (isNumber(appContext)){
            duration = appContext as number;
        }
        let type = val;
        if(type === "log"){
            type = "info";
        }
        if(type === "warn"){
            type = "warning";
        }

        const _config: MessageConfig = {
            type: type as NotifyType,
            duration: duration,
            ...(config as MessageConfig)
        };
        if (!msg) {
            msg = new MessageManager(appContext as AppContext);
        }
        console.log("kui-message", _config)

        return msg!.add(_config);
    };
    return pre;
}, {} as any)

const Message = Object.assign({
    ...message,
    install: (app: App) => {
        app.component(_msgName, _message);
    },
});
export default Message as MessageFn;
