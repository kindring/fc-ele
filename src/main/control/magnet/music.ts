import {dialog} from "electron"
import fs from "fs-extra";
import {IAudioMetadata, parseFile} from "music-metadata";
import {ErrorCode, Page, RequestData, ResponseData} from "@/types/apiTypes.ts";
import Logger from "@/util/logger.ts";
import {MusicInfo, MusicScanSetting, MusicType, param_music_like, PlayList} from "@/types/musicType.ts";
import {
    addMusic,
    addPlayList,
    addPlayListMusic,
    addScanConfig, db_playlist_delete,
    deleteScanConfig,
    editPlayList,
    get_like_playlist,
    getMusicByKey,
    getMusicsByPlayListId,
    getMusicsByScanId,
    getPlayList,
    getScanConfig,
    getScanConfigByPath,
    initDefaultPlayList,
    likeMusic, playlist_find_by_id, playlist_song_remove,
    removePlayListMusic,
    updateScanConfig
} from "@/common/db/db_music.ts";
import {handle, PromiseResult, ResType} from "@/util/promiseHandle.ts";
import {t_gen_res, t_res_ok} from "@/main/tools/ipcRouter.ts";
import path from "path";
import {getRandomStr, randomAzStr, randomNumber} from "@/util/random.ts";

let logger = Logger.logger('music', 'info');

const music_ext_list = [
    '.mp3',
    '.flac',
    '.ape',
    '.wav',
    '.wma',
    '.ogg',
    '.m4a',
    '.aac',
    '.wma',
    '.wav',
    '.flac',
    '.m4a',
]

const scan_task: {[key: number]: any} = {

}

export async function c_fetchPlayList(requestData: RequestData<null>)
{
    let [err, playList] = await getPlayList();
    if (err)
    {
        logger.error(`[获取扫描设置列表失败] ${err.message}`)
        return t_gen_res(requestData, ErrorCode.db, '获取扫描设置列表失败', [])
    }
    return t_gen_res(requestData, ErrorCode.success, '', playList);
}

/**
 * 选择扫描目录
 * @param requestData
 */
export async function c_scanMusicSelect(requestData: RequestData<string>): Promise<ResponseData<string>>
{
    let defaultPath = requestData.data;
    let result = await dialog.showOpenDialog({
        defaultPath: defaultPath,
        properties: ['openDirectory'],
        title: '请选择扫描目录'
    })
    logger.info(`scan dir ${result.filePaths[0]}`);

    return t_res_ok(requestData, result.filePaths[0]);
}


/**
 * 获取扫描设置列表
 * @param requestData
 */
export async function c_scanSettings(requestData: RequestData<null>) : Promise<ResponseData<MusicScanSetting[]>>
{
    let responseData: ResponseData<any>
    let [err, scanSettingList] = await getScanConfig();
    if (err) {
        logger.error(`[获取扫描设置列表失败] ${err.message}`)
        return t_gen_res(requestData, ErrorCode.db, '获取扫描设置列表失败', [])
    }
    responseData = t_gen_res(requestData, ErrorCode.success, '', scanSettingList)
    return responseData;
}


/**
 * 添加扫描设置
 * @param requestData
 */
export async function c_scanMusicAdd(requestData: RequestData<MusicScanSetting>) : Promise<ResponseData<boolean>>
{
    let scanSetting: MusicScanSetting = requestData.data;
    let res: ResType<any> = false;
    // 判断路径是否重复
    let [err, scanSettingList] = await getScanConfigByPath(scanSetting.path)
    if (err) {
        logger.error(`[获取扫描设置列表失败] ${err.message}`)
        return t_gen_res(requestData, ErrorCode.db, '获取扫描设置列表失败', false);
    }
    scanSettingList = scanSettingList as MusicScanSetting[];
    if (scanSettingList.length> 0) {
        logger.error(`[扫描路径重复] ${scanSetting.path}`)
        return t_gen_res(requestData, ErrorCode.params, '扫描路径重复', false);
    }
    [err, res] = await addScanConfig(scanSetting);
    if (err) {
        logger.error(`[添加扫描设置失败] ${err.message}`)
        return t_gen_res(requestData, ErrorCode.db, '添加扫描设置失败', false)
    }
    res = res as boolean;
    if (res) {
        _scan_(scanSetting);
    }
    return t_res_ok(requestData,  res)
}


/**
 * 更新扫描配置
 * @param requestData
 */
export async function c_scanMusicUpdate(requestData: RequestData<MusicScanSetting>) : Promise<ResponseData<boolean>>
{
    let scanSetting: MusicScanSetting = requestData.data;
    let res: ResType<any> = false;
    // 判断路径是否重复
    let [err, scanSettingList] = await getScanConfigByPath(scanSetting.path, [scanSetting.id])
    if (err) {
        logger.error(`[获取扫描设置列表失败] ${err.message}`)
        return t_gen_res(requestData, ErrorCode.db, '获取扫描设置列表失败', false)
    }
    scanSettingList = scanSettingList as MusicScanSetting[];
    if (scanSettingList.length> 0)
    {
        // 防止找到正在修改的配置
        logger.error(`[扫描路径重复] ${scanSetting.path}`)
        return t_gen_res(requestData, ErrorCode.params, '扫描路径重复', false)
    }
    [err, res] = await updateScanConfig(scanSetting);

    if (err) {
        logger.error(`[更新扫描设置失败] ${err.message}`)
        return t_gen_res(requestData, ErrorCode.db, '更新扫描设置失败', false)
    }
    res = res as boolean;
    return t_res_ok(requestData,  res)
}

/**
 * 删除扫描配置
 * @param requestData
 */
export async function c_scanMusicDelete(requestData: RequestData<number>) : Promise<ResponseData<boolean>>
{
    let res: ResType<any> = false;
    let err : Error | null = null;
    [err, res] = await deleteScanConfig(requestData.data);
    if (err) {
        logger.error(`[删除扫描设置失败] ${err.message}`)
        return t_gen_res(requestData, ErrorCode.db, '删除扫描设置失败', false)
    }
    res = res as boolean;
    return t_res_ok(requestData,  res)
}

/**
 * 分页查询
 * @param requestData
 */
export async function c_load_scan_music(requestData: RequestData<Page<number>>)
    : Promise<ResponseData<Page<MusicInfo[]>>>
{
    let queryParam = requestData.data;
    let [err, res] = await getMusicsByScanId(queryParam.data,
        queryParam.key,
        queryParam.page,
        queryParam.size,
        queryParam.sort,
        queryParam.order)
    if (err) {
        logger.error(`[音频扫描] 获取扫描到的音频失败 ${err.message}`)
        return t_gen_res(requestData, ErrorCode.db, '获取扫描到的音频失败', null)
    }
    res = res as Page<MusicInfo[]>;
    return t_res_ok(requestData, res)
}



/**
 * 喜欢音频
 * @param requestData
 */
export async function c_like_music(requestData: RequestData<param_music_like>) : Promise<ResponseData<boolean>>
{
    const __func__ = 'c_like_music'
    let likeData = requestData.data;
    logger.info(`[喜欢音频] ${likeData.musicId} ${likeData.isLike}`)


    let [err, res] = await get_like_playlist();
    if (err) {
        logger.error(`[获取喜欢列表] ${err.message}`)
        return t_gen_res(requestData, ErrorCode.db, '获取喜欢列表失败', false)
    }
    let playList = res as PlayList;
    if (playList.id === -1) {
        logger.error(`[添加喜欢列表] 无法找到我喜欢的歌单 ${err.message}`)
        initDefaultPlayList();
        return t_gen_res(requestData, ErrorCode.db, '添加喜欢列表失败', false)
    }
    let bool: ResType<boolean> = false;
    // 歌单中添加歌曲
    if (likeData.isLike)
    {
        // 判断歌单中是否存在该歌曲
        [err, bool] = await addPlayListMusic(playList.id, likeData.musicId);
        if (err) {
            logger.error(`${__func__} [添加喜欢列表] ${err.message}`)
            return t_gen_res(requestData, ErrorCode.db, '添加喜欢列表失败', false)
        }
    } else
    {
        // 取消喜欢
        [err, bool] = await removePlayListMusic(playList.id, likeData.musicId);
        if (err) {
            logger.error(`${__func__} [取消喜欢] ${err.message}`)
            return t_gen_res(requestData, ErrorCode.db, '取消喜欢失败', false)
        }
    }

    [err, bool] = await likeMusic(likeData.musicId, likeData.isLike);
    if (err) {
        logger.error(`${__func__} 更改数据失败 ${err.message}`)
        return t_gen_res(requestData, ErrorCode.db, '喜欢音频失败', false)
    }
    bool = bool as boolean;
    return t_res_ok(requestData,  bool)
}


export async function c_fetchPlayList_music(requestData: RequestData<Page<number>>): Promise<ResponseData<Page<MusicInfo>>>
{
    const __func__ = 'c_fetchPlayList_music()'
    let queryParam = requestData.data as Page<number>;
    logger.info(`[获取歌单音频] ${queryParam}`)
    logger.info(`[获取歌单音频] ${queryParam.data}`)
    let [err, sons] = await getMusicsByPlayListId(queryParam.data,
        queryParam.key,
        queryParam.page,
        queryParam.size,
        queryParam.sort,
        queryParam.order)
    if (err) {
        logger.error(`${__func__} [获取歌单音频] ${err.message}`)
        return t_gen_res(requestData, ErrorCode.db, '获取歌单音频失败', false)
    }
    sons = sons as Page<MusicInfo[]>;
    return t_res_ok(requestData,  sons)
}

async function _read_music_info(filePath: string) : PromiseResult<IAudioMetadata>
{
    let [err, metadata] = await handle(parseFile(filePath));
    if (err) {
        logger.error(`[读取音频文件失败] ${err.message}`)
        return [err, null];
    }
    metadata = metadata as ResType<IAudioMetadata>;
    return [null, metadata as IAudioMetadata];
}


export async function c_playList_add(requestData: RequestData<Partial<PlayList>>) : Promise<ResponseData<boolean>>
{
    let addParam = requestData.data as Partial<PlayList>;
    // 新添加的歌单都不为默认歌单
    addParam.isLike = false;
    let [err, res] = await addPlayList(addParam);
    if (err) {
        return t_gen_res(requestData, ErrorCode.db, '添加歌单失败', false)
    }
    res = res as boolean;
    return t_res_ok(requestData,  res);
}

export async function c_playlist_edit(requestData: RequestData<Partial<PlayList>>) : Promise<ResponseData<boolean>>
{
    let err: Error | null = null;
    let playList: ResType<PlayList> ,
        res: ResType<boolean>;
    
    let editParam = requestData.data as Partial<PlayList>;
    // 查看歌单是否存在
    if (editParam.id === -1) {
        return t_gen_res(requestData, ErrorCode.db, '歌单不存在', false)
    }
    [err, playList] = await playlist_find_by_id(editParam.id as number);
    if (err) {
        return t_gen_res(requestData, ErrorCode.db, '无法检索歌单', false)
    }
    playList = playList as PlayList;
    if (playList.isLike) {
        return t_gen_res(requestData, ErrorCode.db, '默认歌单不允许编辑', false)
    }
    [err, res] = await editPlayList(editParam);
    if (err) {
        return t_gen_res(requestData, ErrorCode.db, '编辑歌单失败', false)
    }
    res = res as boolean;
    return t_res_ok(requestData,  res);
}

export async function c_playlist_delete(requestData: RequestData<number>) : Promise<ResponseData<boolean>>
{
    let id = requestData.data;
    let err: Error | null = null;
    let playList: ResType<PlayList>,
        res: ResType<boolean>;
    if (id < 0 || id === undefined) {
        return t_gen_res(requestData, ErrorCode.params, 'id参数错误', false)
    }
    [err, playList] = await playlist_find_by_id(id);
    if (err) {
        return t_gen_res(requestData, ErrorCode.db, '无法检索歌单', false);
    }
    playList = playList as PlayList;
    if (playList === undefined || playList === null) {
        return t_gen_res(requestData, ErrorCode.db, '歌单不存在', false)
    }
    if (playList.isLike) {
        return t_gen_res(requestData, ErrorCode.permission, '默认歌单不允许删除', false)
    }
    if (playList.id === -1) {
        return t_gen_res(requestData, ErrorCode.db, '歌单不存在', false)
    }
    // 移除歌单对应的歌曲
    [err, res] = await playlist_song_remove(playList.id);
    if (err) {
        return t_gen_res(requestData, ErrorCode.db, '删除歌单歌曲失败', false)
    }
    [err, res] = await db_playlist_delete(playList.id);
    if (res) {
        return t_gen_res(requestData, ErrorCode.db, '删除歌单失败', false)
    }
    res = res as boolean;
    return t_res_ok(requestData,  res);
}

/**
 * 获取扫描配置下的音频文件
 */
async function _scan_dir(scanSetting: MusicScanSetting, basePath: string = "") :PromiseResult<any>
{
    // logger.info(`_scan_dir ${scanSetting.path}`)
    let scanPath = basePath? basePath : scanSetting.path;
    let [err, res] = await handle( fs.readdir(scanPath))
    let fileArray: string[] = [];
    if (err) {
        logger.error(`[扫描目录失败] ${err.message}`)
        return [err, false];
    }
    // console.log(res)
    // 排除目录
    for (let filename of res as string[])
    {
        // console.log(filename)
        // 判断类型
        let filePath = path.join(scanPath, filename)
        // 排除隐藏文件
        if (filename.startsWith('.'))
        {
            console.log(`[排除隐藏文件] ${filename}`)
            continue;
        }
        if (fs.statSync(filePath).isDirectory())
        {
            if (!scanSetting.scanSubDir)
            {
                continue;
            }
            let _;
            [err, _] = await _scan_dir(scanSetting, filePath);
            if (err)
            {
                logger.error(`[扫描子目录失败] ${err.message} ${_}`)
                return [err, false];
            }
        }

        // 获取文件后缀
        let ext = path.extname(filename);
        ext = ext.toLowerCase();
        if ( music_ext_list.includes(ext))
        {
            fileArray.push(filePath);
        }
    }
    return [err, fileArray];
}
// https://www.npmjs.com/package/music-metadata

export async function _next_id(scanSetting_id: number):Promise<string>
{
    let id = randomAzStr(randomNumber(16));
    id = `${scanSetting_id}_${id}`
    let [err, musicInfo] = await getMusicByKey(id);
    if (err)
    {
        logger.error(`[生成id失败] ${err.message}`)
        return id;
    }
    if (!musicInfo)
    {
        return id;
    }
    // 循环10次生成id
    for (let i = 0; i < 20; i++)
    {
        let next_id = randomAzStr(randomNumber(16 + i));
        // id 采用此次的前6位 加上新生成的后6位
        next_id = id.substring(4, 6) + next_id.substring(next_id.length - 6, 6);
        next_id = getRandomStr(next_id + id, 8);
        next_id = `${scanSetting_id}_${next_id}`;
        [err, musicInfo] = await getMusicByKey(id);
        if (err)
        {
            logger.error(`[生成id失败] ${err.message}`)
            return next_id;
        }
        if (!musicInfo)
        {
            return next_id;
        }
    }
    return `${scanSetting_id}_${scanSetting_id}_${id.substring(5, 3)}_${id.substring(5, 3)}`;
}

export async function _scan_(scanSetting: MusicScanSetting)
{
    const __func__ = '_scan_(scanSetting: MusicScanSetting)';
    if (scanSetting && scanSetting.id && scan_task[scanSetting.id])
    {
        logger.error(`[扫描任务重复] ${scanSetting.id}`)
        return;
    }
    scan_task[scanSetting.id] = true;
    // 判断扫描路径是否存在
    if (!fs.existsSync(scanSetting.path))
    {
        logger.error(`${__func__} [${scanSetting.id}] ${scanSetting.name} 路径丢失 ${scanSetting.path}`)
        return;
    }
    // console.log(scanSetting)
    // console.log(scanSetting.path)
    // 缓存扫描信息
    let catchPath = path.join(scanSetting.path, './.catch.json')
    let catchInfo: Record<string, number> = {};
    // 判断文件是否存在
    if ( fs.existsSync(catchPath) )
    {
        catchInfo = JSON.parse(fs.readFileSync(catchPath, 'utf-8'));
    }
    // console.log(catchInfo)

    let [err, fileArray] = await _scan_dir(scanSetting);

    let success_count = 0;
    if (err) {
        logger.error(`[扫描目录失败] ${err.message}`)
        return;
    }


    console.log(fileArray)
    for (let filePath of fileArray as string)
    {
        // 判断文件是否已经扫描过
        if (catchInfo[filePath])
        {
            // 判断文件最新的时间
            if (catchInfo[filePath] >= fs.statSync(filePath).mtimeMs)
            {
                // 文件没有更新, 跳过
                continue;
            }
        }
        // 尝试获取音频文件
        let musicMetaData: ResType<IAudioMetadata> = null;
        [err, musicMetaData] = await _read_music_info(filePath);
        if (err) {
            logger.error(`[获取音频文件信息失败] ${err.message} ${filePath}`)
            continue;
        }
        if (musicMetaData)
        {
            // console.log(musicMetaData)
            // 获取文件更新时间
            catchInfo[filePath] = fs.statSync(filePath).mtimeMs;
            // 将封面文件写入到 本地 文件夹
            let coversDir = path.join(scanSetting.path, './.covers');
            let coverName = "";
            // 如果文件的路径是scanSetting.path的子目录, 则再.cobers 目录下创建对应的子文件夹
            if (filePath.startsWith(scanSetting.path))
            {
                let subDir = filePath.substring(scanSetting.path.length + 1);
                subDir = path.join(coversDir, subDir);
                coversDir = path.dirname(subDir);
            }
            if (!fs.existsSync(coversDir))
            {
                fs.mkdirSync(coversDir,  { recursive: true });
            }
            // console.log(musicMetaData.common)
            let music_name = '';
            if (musicMetaData.common.title)
            {
                music_name = musicMetaData.common.title;
                coverName = music_name + `_${musicMetaData.common.artist??''}`
            } else
            {
                music_name = path.basename(filePath);
                // 移除后缀名
                music_name = music_name.substring(0, music_name.lastIndexOf('.'));
                coverName = music_name;
            }

            // 移除music_name中的特殊字符
            coverName = coverName.replace(/[\\/:*?"<>|]/g, '');
            // let nextId: string = await _next_id(scanSetting.id);
            // 如果是子文件夹. 则创建对应的子目录存放封面

            let coverPath = "";

            if (musicMetaData.common.picture && musicMetaData.common.picture.length > 0)
            {
                coverPath = path.join(coversDir, `${coverName}.jpg`);
                // console.log(coverPath)
                // 判断封面是否存在
                if (fs.existsSync(coverPath))
                {
                    coverPath = path.join(coversDir, `${coverName}_${randomAzStr(4)}.jpg`);
                }
                fs.writeFileSync(coverPath, musicMetaData.common.picture[0].data);
                // console.log("写入成功")
            } else {
                console.log(`[获取音频文件信息失败] ${filePath}`)
            }
            console.log(musicMetaData)
            let musicInfo: MusicInfo = {
                id: -1,
                key: '',
                name: music_name,
                album: musicMetaData.common.album? musicMetaData.common.album : '',
                artists: musicMetaData.common.artists? musicMetaData.common.artists : [],
                cover: coverPath,// 存储在本地的封面文件地址, 只存储基础的文件名称, 其它内容基于本地目录进行拼接
                duration: musicMetaData.format.duration? musicMetaData.format.duration : 0,
                isLike: false,
                origin: '',
                type: MusicType.local,
                scanId: scanSetting.id,
                filePath: filePath,
                isLocal: true,
                tags: musicMetaData.common.genre? musicMetaData.common.genre : [],
                playCount: 0,
                lyricPath: '',
            };
            // console.log(musicInfo)
            let _bool : ResType<boolean> = false;
            [err, _bool] = await addMusic(musicInfo) ;
            if (err)
            {
                logger.error(`[添加歌曲失败] ${err.message} ${musicInfo} ${_bool}`)
                continue;
            }
            success_count++;
        }
    }
    logger.info(`[扫描目录] 扫描配置: ${scanSetting.id} 新增歌曲: ${success_count} 目录总歌曲: ${fileArray.length}`)
    // 保存扫描信息
    fs.writeFileSync(catchPath, JSON.stringify(catchInfo));

    // 移除扫描任务
    delete scan_task[scanSetting.id];
}

export async function start_scan()
{
    let [err, scanSettingList] = await getScanConfig();
    if (err)
    {
        logger.error(`[获取扫描配置失败] ${err.message}`)
        return;
    }
    for (let scanSetting of scanSettingList as MusicScanSetting[])
    {
        if (scanSetting)
        {
            _scan_(scanSetting);
        }
    }
}


export async function c_music_appStart(requestData: RequestData<any>)
{
    logger.info(`[音乐播放器启动]`)
    start_scan();
    return t_res_ok(requestData, true)
}

