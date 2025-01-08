export function copyText (content: string): Promise<boolean>{
    return new Promise((resolve,reject)=>{
        // 判断是否支持 clipboard api 复制
        try {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(content).then(() => {
                    resolve(true);
                })
            } else {
                let textarea = document.createElement('textarea');
                // 隐藏此输入框
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                textarea.style.top = '20px';
                document.body.appendChild(textarea);
                // 赋值
                textarea.value = content;
                // 选中
                textarea.select();
                // 复制
                document.execCommand('copy', true);
                // 移除输入框
                document.body.removeChild(textarea);
            }
            resolve(true);
        } catch (error) {
            resolve(false);
            reject(error);
        }
    })
}


