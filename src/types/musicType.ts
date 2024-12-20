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
    isLike: boolean; // 是否为默认收藏歌单, 默认歌单不允许编辑信息
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
// 歌单音频信息
export interface PlayListMusicInfo {
    id: string;
    musicId: string;
    playListId: string;
    order: number;
}


export interface MusicSearchInfo {
    // 搜索路径
    // 自动转换文件
}

export interface MusicScanSetting {
    name: string;// 配置名称
    path: string;// 扫描路径
    scanSubDir: boolean;// 是否扫描子目录
    // 是否文件去重
    isFileRepeat: boolean;
}


export enum MusicTableName
{
    music_play_list = 'music_play_list',// 歌单表
    music_scan_setting = 'music_scan_setting',// 扫描配置
    music_songs = 'music_songs',// 歌曲表
    music_play_list_songs = 'music_play_list_songs',// 歌单歌曲表
}

