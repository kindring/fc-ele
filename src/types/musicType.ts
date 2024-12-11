export interface PlayList {
    id: string;
    name: string;   // 歌单名称
    icon: string;   // 歌单icon
    cover: string;  // 封面图片地址
    description: string;    // 歌单描述
    playCount: number;  // 播放量
    trackCount: number; // 歌曲数量
    createTime: number; // 创建时间 时间戳
    isTagSearch: boolean;  // 是否参与标签搜索
    lastPlayTime: number;  // 上次播放时间 时间戳
    isSync: boolean; // 是否参与跨设备同步
    isPublic: boolean; // 是否公开
    isLike: boolean; // 是否为默认收藏歌单
}

export enum MusicType{
    local = 0, // 本地音乐
    couldMusic = 1, // 云网络内的其它音乐
}

export interface MusicInfo {
    id: string;
    name: string;   // 歌曲名称
    artists: string[];  // 歌手名称
    album: string;  // 专辑名称
    cover: string;  // 歌曲封面图片地址
    duration: number;   // 歌曲时长 单位: 秒
    isLike: boolean;  // 是否喜欢
    origin: string; // 歌曲来源 用于实现远程链接设备获取音频源文件.
    type: MusicType; // 歌曲类型, 用于区分歌曲源存放位置
    isLocal: boolean; // 本地是否存在
    filePath: string; // 文件存放路径
    lyricPath: string;  // 歌词文件地址
    tags: string[]; // 歌曲标签
    playCount: number;  // 播放次数
}


export interface MusicSearchInfo {
    // 搜索路径
    // 自动转换文件
}


