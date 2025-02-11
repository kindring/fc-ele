import Logger from "@/util/logger.ts";
import { loadDb} from "@/common/db/db.ts";
import {handle, PromiseResult, ResType} from "@/util/promiseHandle.ts";
import {AppDbName} from "@/types/appConfig.ts";
import {Knex} from "knex";
import {MusicInfo, MusicScanSetting, MusicTableName, PlayList} from "@/types/musicType.ts";
import {Order, Page} from "@/types/apiTypes.ts";

let logger = Logger.logger('music_db', 'info');

const Music_field = [
    'id',
    'key',
    'name',
    'artists',
    'album',
    'cover',
    'duration',
    'isLike',
    'origin',
    'type',
    'isLocal',
    'filePath',
    'lyricPath',
    'tags',
    'playCount',
    'scanId',
]

const Music_playList_field = [
    'id',
    'name',
    'icon',
    'cover',
    'description',
    'playCount',
    'trackCount',
    'createTime',
    'isTagSearch',
    'lastPlayTime',
    'isSync',
    'isPublic',
    'isLike',
]

async function _initScanConfigTable(db : Knex): PromiseResult<boolean> {
    let [err, hasTable] = await handle(
        db.schema.hasTable(MusicTableName.music_scan_setting)
    )
    if (err) {
        err = err as Error;
        logger.error(`[音频扫描库] ${err.message}`)
        return [new Error('音频扫描库初始化失败'), false]
    }

    if (hasTable) {
        return [null, true];
    }
    let [createErr, _res] = await handle(db?.schema.createTable(MusicTableName.music_scan_setting, (table) => {
        // 初始化扫描配置
        logger.info(`[初始化音频扫描库]`)
        table.increments('id').primary()
        table.string('name')
        table.string('path')
        table.boolean('scanSubDir')
        table.boolean('isFileRepeat')
    }))
    if (createErr) {
        createErr = createErr as Error;
        logger.error(`[初始化磁贴表失败] ${createErr.message}`)
        return [createErr, false];
    }
    logger.info('[初始化音频扫描配置成功]')
    return [null, true];
}

async function _initPlayListTable(db : Knex): PromiseResult<boolean> {
    let [err, hasTable] = await handle(
        db.schema.hasTable(MusicTableName.music_play_list)
    )
    if (err) {
        err = err as Error;
        logger.error(`[歌单初始化] ${err.message}`)
        return [new Error('歌单初始化'), false]
    }
    if (hasTable) {
        return [null, true];
    }
    let [createErr, _res] = await handle(
        db.schema.createTable(MusicTableName.music_play_list, (table) => {
            logger.info(`[初始化音频播放列表库]`)
            table.increments('id').primary()
            table.string('name')
            table.string('icon')
            table.string('cover')
            table.string('description')
            table.integer('playCount')
            table.integer('trackCount')
            table.integer('createTime')
            table.boolean('isTagSearch')
            table.integer('lastPlayTime')
            table.boolean('isSync')
            table.boolean('isPublic')
            table.boolean('isLike')
        }))
    if (createErr) {
        createErr = createErr as Error;
        logger.error(`[初始化歌单失败] ${createErr.message}`)
        return [createErr, false];
    }
    return [null, true];
}

async function _initSongsTable(db : Knex): PromiseResult<boolean>
{
    let [err, hasTable] = await handle(
        db.schema.hasTable(MusicTableName.music_songs)
    )
    if (err) {
        err = err as Error;
        logger.error(`[音频表初始化] ${err.message}`)
        return [new Error('音频表初始化'), false]
    }
    if (hasTable) {
        if (true)
        {
            // 移除旧数据
            // 更新表字段
            console.log('修改音频表信息');
            // 打印表结构
            // 移除表
            // 字段修改 scanId 从 string -> integer
            // await db.schema.alterTable(MusicTableName.music_songs, (table) => {
            //     table.dropColumn('scanId')
            // })

            // await db.schema.alterTable(MusicTableName.music_songs, (table) => {
            //     // table.string('key')
            //     table.integer('scanId')
            // })
            // await removeMusicByScanId(4);
        }
        return [null, true];
    }
    let [createErr, _res] = await handle(
        db.schema.createTable(MusicTableName.music_songs, (table) => {
            logger.info(`[初始化音频库]`)
            table.increments('id').primary()
            table.string('key')
            table.string('name')
            table.string('artists')
            table.string('album')
            table.string('cover')
            table.integer('duration')
            table.boolean('isLike')
            table.string('origin')
            table.integer('type')
            table.boolean('isLocal')
            table.string('filePath')
            table.string('lyricPath')
            table.string('tags')
            table.integer('playCount')
            table.integer('scanId')
        }))
    if (createErr) {
        createErr = createErr as Error;
        logger.error(`[初始化音频库失败] ${createErr.message}`)
        return [createErr, false];
    }
    logger.info('[初始化音频库成功]')
    return [null, true];
}

async function _initPlaylistSongs(db : Knex): PromiseResult<boolean>
{
    let [err, hasTable] = await handle(
        db.schema.hasTable(MusicTableName.music_play_list_songs)
    )
    if (err) {
        err = err as Error;
        logger.error(`[歌单歌曲表初始化] ${err.message}`)
        return [new Error('歌单歌曲表初始化'), false]
    }
    // 删除表
    // if (hasTable) {
    //     await db.schema.dropTable(MusicTableName.music_play_list_songs)
    // }
    if (hasTable) {
        return [null, true];
    }
    let [createErr, _res] = await handle(
        db.schema.createTable(MusicTableName.music_play_list_songs, (table) => {
            logger.info(`[初始化歌单歌曲库]`)
            table.increments('id').primary()
            table.integer('musicId')
            table.integer('playListId')
            table.integer('order')
        }))
    if (createErr) {
        createErr = createErr as Error;
        logger.error(`[初始化歌单歌曲库失败] ${createErr.message}`)
        return [createErr, false];
    }
    logger.info('[初始化歌单歌曲库成功]')
    return [null, true];
}


export async function initMusicData() : PromiseResult<boolean>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), false]
    }
    let [err, res] = await _initScanConfigTable(db);
    if (err) {
        err = err as Error;
        logger.error(`[初始化扫描库失败] ${err.message}`)
        return [err, false];
    }
    [err, res] = await _initPlayListTable(db);
    if (err) {
        err = err as Error;
        logger.error(`[初始化歌单库失败] ${err.message}`)
        return [err, false];
    }

    [err, res] = await initDefaultPlayList();
    if (err) {
        err = err as Error;
        logger.error(`[初始化默认播放列表失败] ${err.message}`)
        return [err, false];
    }
    [err, res] = await _initSongsTable(db);
    if (err) {
        err = err as Error;
        logger.error(`[初始化音频库失败] ${err.message}`)
        return [err, false];
    }
    [err, res] = await _initPlaylistSongs(db);
    if (err) {
        err = err as Error;
        logger.error(`[初始化歌单歌曲库失败] ${err.message}`)
        return [err, false];
    }


    logger.info('[初始化音频库成功]')
    return [null, res]
}

export async function initDefaultPlayList(): PromiseResult<boolean>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('[初始化歌单] 数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), false]
    }
    // 判断默认歌单是否存在
    let [err, res] = await handle(db.select('*').from(MusicTableName.music_play_list).where('isLike', true))
    if (err) {
        err = err as Error;
        logger.error(`[初始化歌单] 检索默认歌单 => ${err.message}`)
        return [err, false];
    }
    res = res as MusicScanSetting[];
    if (res.length > 0) {
        return [null, true];
    }
    let defaultPlayList = {
        name: '我的喜爱',
        icon: 'favorite',
        cover: 'favorite',
        description: '我的喜爱',
        playCount: 0,
        trackCount: 0,
        createTime: Date.now(),
        isTagSearch: false,
        lastPlayTime: Date.now(),
        isSync: false,
        isPublic: false,
        isLike: true,
    };
    [err, res] = await handle(db.insert(defaultPlayList).into(MusicTableName.music_play_list))
    if (err) {
        err = err as Error;
        logger.error(`[初始化我的喜爱歌单失败] ${err.message}`)
        return [err, false];
    }
    logger.info('[初始化我的喜爱歌单成功]')
    return [null, true];
}

// 根据扫描地址获取扫描配置
export async function getScanConfigByPath(path: string, id: number[] = []) : PromiseResult<MusicScanSetting[]>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), null]
    }
    // 路径应该是前面部分不能重复, 例如如果已经添加了 /home/user/music 那么 /home/user/music/chinese 就无法添加
    // /home/user/music
    let [err, res] = await handle(
        db.select('name', 'path', 'scanSubDir', 'isFileRepeat')
            .from(MusicTableName.music_scan_setting)
            .where('path', 'like', `${path}%`)
            .orWhere('path', path)
            // 排除id
            .whereNotIn('id', id)
    )
    if (err) {
        err = err as Error;
        logger.error(`[获取扫描配置失败] ${err.message}`)
        return [err, null];
    }
    return [null, res as MusicScanSetting[]];
}

export async function getScanConfig() : PromiseResult<MusicScanSetting[]>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), null]
    }
    // 将下面的 scanSubDir 转为 boolean 类型

    let [err, res] = await handle(
        db.select('id', 'name', 'path', 'scanSubDir', 'isFileRepeat')
            .from<MusicScanSetting>(MusicTableName.music_scan_setting)
    )
    if (err) {
        err = err as Error;
        logger.error(`[获取扫描配置失败] ${err.message}`)
        return [err, null];
    }
    return [null, res as MusicScanSetting[]];
}

export async function addScanConfig(scanConfig: MusicScanSetting) : PromiseResult<boolean>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), false]
    }
    // 移除其中的 id
    let addScanConfig = {
        name: scanConfig.name,
        path: scanConfig.path,
        scanSubDir: scanConfig.scanSubDir,
        isFileRepeat: scanConfig.isFileRepeat
    }
    let [err, _res] = await handle(
        db.insert(addScanConfig).into(MusicTableName.music_scan_setting)
    )
    if (err) {
        err = err as Error;
        logger.error(`[添加扫描配置失败] ${err.message}`)
        return [err, false];
    }
    return [null, true];
}

export async function updateScanConfig(scanConfig: MusicScanSetting) : PromiseResult<boolean>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), false]
    }
    let [err, _res] = await handle(
        db.update(scanConfig).into(MusicTableName.music_scan_setting).where('id', scanConfig.id)
    )
    if (err) {
        err = err as Error;
    }
    return [err, true];
}

export async function deleteScanConfig(id: number) : PromiseResult<boolean>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), false]
    }
    let [err, _res] = await handle(
        db.delete().from(MusicTableName.music_scan_setting).where('id', id)
    )
    if (err) {
        err= err as Error;
    }
    return [err, true];
}


export async function getPlayList() : PromiseResult<PlayList[]>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), null]
    }
    let [err, res] = await handle(
        db.select('id', 'name', 'icon', 'cover', 'description', 'playCount', 'trackCount', 'createTime', 'isTagSearch', 'lastPlayTime', 'isSync', 'isPublic', 'isLike')
            .from(MusicTableName.music_play_list)
    )
    if (err) {
        err = err as Error;
        logger.error(`[获取播放列表失败] ${err.message}`)
        return [err, null];
    }
    return [null, res as PlayList[]];
}

export async function playlist_find_by_id(id: number): PromiseResult<PlayList>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), null]
    }
    let [err, _res] = await handle(
        db.select(...Music_playList_field)
            .from(MusicTableName.music_play_list)
            .where('id', id)
            .first()
    )
    if (err) {
        err = err as Error;
        logger.error(`[获取播放列表失败] ${err.message}`)
        return [err, null];
    }
    return [null, _res as PlayList];
}

export async function db_playlist_delete(id: number) : PromiseResult<boolean>
{
    const __func__ = 'playlist_delete()'
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error(`${__func__} 数据库初始化失败`)
        return [new Error('音乐数据库初始化失败'), false]
    }
    let [err, _res] = await handle(
        db.delete().from(MusicTableName.music_play_list).where('id', id)
    )
    if (err) {
        err = err as Error;
        logger.error(`${__func__} [删除播放列表失败] ${err.message}`)
        return [err, false];
    }
    return [null, true];
}

export async function addPlayList(playList: Partial<PlayList>) : PromiseResult<boolean>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), false]
    }
    let [err, _res] = await handle(
        db.insert(playList).into(MusicTableName.music_play_list)
    )
    if (err) {
        err = err as Error;
        logger.error(`[添加播放列表失败] ${err.message}`)
        return [err, false];
    }
    return [null, true];
}

export async function get_like_playlist(): PromiseResult<PlayList>
{
    const __func__ = 'get_like_playlist()'
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error(`${__func__} 数据库初始化失败`)
        return [new Error('[获取歌单] 音乐数据库初始化失败'), null]
    }
    let [err, res] = await handle(
        db.select('id', 'name', 'icon', 'cover', 'description', 'playCount', 'trackCount', 'createTime', 'isTagSearch', 'lastPlayTime', 'isSync', 'isPublic', 'isLike')
            .from(MusicTableName.music_play_list)
            .where('isLike', true)
    )
    if (err) {
        err = err as Error;
        logger.error(`${__func__} 获取喜爱的歌单失败 ${err.message}`)
        return [err, null];
    }
    res = res as ResType<PlayList[]>
    if (!res || res.length === 0) {
        logger.error(`${__func__} 获取喜爱的歌单失败, 歌单不存在`)
        return [new Error('[获取歌单] 歌单不存在'), null];
    }
    let playList = res[0] as PlayList;
    return [null, playList];
}

export async function addPlayListMusic(playlist_id: number, music_id: number) : PromiseResult<boolean>
{
    const __func__ = 'addPlayListMusic()'
    const __key__ = '添加歌曲至播放列表'
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error(`${__func__} 数据库初始化失败`)
        return [new Error(`${__key__} 音乐数据库初始化失败`), false]
    }
    // 如果播放列表中已存在, 则返回 true
    let [err, _res] = await handle(
        db.select('id')
            .from(MusicTableName.music_play_list_songs)
            .where('playListId', playlist_id)
            .andWhere('musicId', music_id)
    )
    if (err) {
        err = err as Error;
        logger.error(`${__func__} ${__key__} 获取音频是否存在失败 ${err.message}`)
        return [err, false];
    }
    if (_res && _res.length > 0) {
        return [null, true];
    }
    [err, _res] = await handle(
        db.insert({
            playListId: playlist_id,
            musicId: music_id,
            order: 0
        }).into(MusicTableName.music_play_list_songs)
    )
    if (err) {
        err = err as Error;
        logger.error(`${__func__} ${__key__} 添加失败 ${err.message}`)
        return [err, false];
    }
    return [null, true];
    
}

export async function removePlayListMusic(playlist_id: number, music_id: number) : PromiseResult<boolean>
{
    const __func__ = 'addPlayListMusic()'
    const __key__ = '列表移除歌曲'
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error(`${__func__} 数据库初始化失败`)
        return [new Error(`${__key__} 音乐数据库初始化失败`), false]
    }
    let [err, _res] = await handle(
        db.delete()
            .from(MusicTableName.music_play_list_songs)
            .where('playListId', playlist_id)
            .andWhere('musicId', music_id)
    )
    if (err) {
        err = err as Error;
        logger.error(`${__func__} ${__key__} 移除失败 ${err.message}`)
        return [err, false];
    }
    return [null, true];
}

export async function playlist_song_remove(playlist_id: number) : PromiseResult<boolean>
{
    const __func__ = 'playlist_song_remove()'
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error(`${__func__} 数据库初始化失败`)
        return [new Error('[移除播放列表歌曲] 音乐数据库初始化失败'), false]
    }
    let [err, _res] = await handle(
        db.delete().from(MusicTableName.music_play_list_songs).where('playListId', playlist_id)
    )
    if (err) {
        err = err as Error;
        logger.error(`${__func__} 移除歌单失败 ${err.message}`)
        return [err, false];
    }
    return [null, true];
}

export async function editPlayList(playlist: Partial<PlayList>) : PromiseResult<boolean>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), false]
    }
    let [err, _res] = await handle(
        db.update(playlist).into(MusicTableName.music_play_list).where('id', playlist.id)
    )
   if (err) {
       err = err as Error;
       logger.error(`[编辑播放列表失败] ${err.message}`)
       return [err, false];
   }
   return [null, true];
}

export async function deletePlayList(playlist_id: number) : PromiseResult<boolean>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), false]
    }
    let [err, _res] = await handle(
        db.delete().from(MusicTableName.music_play_list).where('id', playlist_id)
    )
    if (err) {
        err = err as Error;
        logger.error(`[删除播放列表失败] ${err.message}`)
        return [err, false];
    }
    return [null, true];
}



export async function getMusicByKey(musicKey: string) : PromiseResult<MusicInfo>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), null]
    }
    let [err, res] = await handle(
        db.select(...Music_field)
            .from(MusicTableName.music_songs)
            .where('key', musicKey)
    )
    if (err) {
        err = err as Error;
        logger.error(`[获取音乐失败] ${err.message}`)
        return [err, null];
    }
    return [null, res as ResType<MusicInfo>];
}

export async function addMusic(music: MusicInfo): PromiseResult<boolean>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), false]
    }
    let saveMusic = {
        key: music.key,
        name: music.name,
        artists: music.artists.join(','),
        album: music.album,
        cover: music.cover,
        duration: music.duration,
        isLike: music.isLike,
        origin: music.origin,
        type: music.type,
        isLocal: music.isLocal,
        filePath: music.filePath,
        lyricPath: music.lyricPath,
        tags: music.tags.join(','),
        playCount:music.playCount,
        scanId: music.scanId
    }
    // console.log(saveMusic);
    let [err, _res] = await handle(
        db.insert(saveMusic).into(MusicTableName.music_songs)
    )
    if (err) {
        err = err as Error;
        logger.error(`[添加音乐失败] ${err.message}`)
        return [err, false];
    }
    return [null, true];
}



export async function likeMusic(id: number, isLike: boolean) : PromiseResult<boolean>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), false]
    }
    let [err, _res] = await handle(
        db.update({isLike: isLike}).from(MusicTableName.music_songs).where('id', id)
    )
    if (err) {
        err = err as Error;
        logger.error(`[喜欢音乐] ${isLike? '喜欢': '取消喜欢'} ${err.message}`)
        return [err, false];
    }
    return [null, true];
}


/**
 * 根据扫描配置ID获取音乐
 * @param scanId
 * @param key
 * @param page
 * @param size
 * @param sort
 * @param order
 */
export async function getMusicsByScanId(scanId: number, key: string = '', page: number = 1, size: number = 10,
                                        sort: string = 'id', order: Order = Order.asc)
    : PromiseResult<Page<MusicInfo[]>>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), null]
    }
    let countPromise;
    let resData: Page<MusicInfo[]> = {
        total: 0,
        data: [],
        page: page,
        size: size,
        order: order,
        sort: sort,
        key: key,
    }
    if (page === 1)
    {
        // 第一页尝试获取总数量
        countPromise = db.count('id as count')
            .from(MusicTableName.music_songs)
            .where('scanId', scanId)
            if (key) {
                countPromise.andWhere('key', 'like', `%${key}%`)
            }
    } else
    {
        countPromise = Promise.resolve([{count: 0}]);
    }
    let listPromise = db.select(...Music_field)
        .from(MusicTableName.music_songs)
        .where('scanId', scanId)
        if (key) {
            console.log('key')
            listPromise.andWhere('key', 'like', `%${key}%`)
        }
        listPromise.limit(size)
        .offset((page - 1) * size)
        .orderBy(sort, order)


    let [err, res] = await handle<[[{ count: number}], MusicInfo[]]>(
        Promise.all([countPromise, listPromise]) as Promise<[[{ count: number}], MusicInfo[]]>)
    if (err) {
        err = err as Error;
        logger.error(`[获取扫描歌曲] ${err.message}`)
    }
    if (!res) {
        logger.error(`[获取扫描歌曲] 无法获取指定歌单数据`)
        return [err, resData];
    }
    resData.total = res[0][0].count as number;
    resData.data = res[1] as MusicInfo[];
    console.log(resData);
    return [err, resData];
}

// 移除异常歌单
export async function removeMusicByScanId(scanId: number) : PromiseResult<boolean>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), false]
    }
    let [err, _res] = await handle(
        db.delete().from(MusicTableName.music_songs).where('scanId', scanId)
    )
    if (err) {
        err = err as Error;
        logger.error(`[移除指定歌单音乐列表失败] ${err.message}`)
        return [err, false];
    }
    return [err, true];
}


/**
 * 根据歌单ID获取歌曲
 * @param playListId
 * @param key
 * @param page
 * @param size
 * @param sort
 * @param order
 */
export async function getMusicsByPlayListId(playListId: number, key: string = '', page: number = 1, size: number = 10,
                                        sort: string = 'id', order: Order = Order.asc): PromiseResult<Page<MusicInfo[]>>
{
    const __func__ = `getMusicsByPlayListId`
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error(`${__func__} 数据库初始化失败`)
        return [new Error('音乐数据库初始化失败'), null]
    }
    let countPromise;
    let resData: Page<MusicInfo[]> = {
        total: 0,
        data: [],
        page: page,
        size: size,
        order: order as Order,
        sort: sort,
        key: key,
    }
    // 第一页尝试获取总数量
    if (page === 1)
    {
        countPromise = db.count(`${MusicTableName.music_play_list_songs}.id as count`)
            .from(MusicTableName.music_play_list_songs)
            .join(MusicTableName.music_songs, `${MusicTableName.music_play_list_songs}.musicId`, '=', 'music_songs.id')
            .where(`${MusicTableName.music_play_list_songs}.playListId`, playListId)
            if (key) {
                countPromise.andWhere('key', 'like', `%${key}%`)
            }
    } else
    {
        countPromise = Promise.resolve([{count: 0}]);
    }
    let listPromise = db.select(...Music_field.map(_field=>`${MusicTableName.music_songs}.${_field}`))
        .from(MusicTableName.music_play_list_songs)
        .join(MusicTableName.music_songs, `${MusicTableName.music_play_list_songs}.musicId`, '=', 'music_songs.id')
        .where(`${MusicTableName.music_play_list_songs}.playListId`, playListId)
        if (key) {
            listPromise.andWhere(`${MusicTableName.music_songs}.name`, 'like', `%${key}%`)
        }
        listPromise.limit(size)
        .offset((page - 1) * size)
        .orderBy(`${MusicTableName.music_songs}.${sort}`, order )
    let [err, res] = await handle<[[{ count: number}], MusicInfo[]]>(
        Promise.all([countPromise, listPromise]) as Promise<[[{ count: number}], MusicInfo[]]>)
    if (err) {
        err = err as Error;
        logger.error(`${__func__} [获取歌单歌曲失败] ${err.message}`)
        return [err, resData];
    }
    if (!res) {
        logger.error(`${__func__} [获取歌单歌曲失败] 无法获取指定歌单数据`)
        return [err, resData];
    }
    resData.total = res[0][0].count as number;
    resData.data = res[1] as MusicInfo[];

    return [err, resData];
}
