import Logger from "@/util/logger.ts";
import { loadDb} from "@/common/db/db.ts";
import {handle, PromiseResult} from "@/util/promiseHandle.ts";
import {AppDbName} from "@/types/appConfig.ts";
import {Knex} from "knex";
import {MusicScanSetting, MusicTableName} from "@/types/musicType.ts";

let logger = Logger.logger('music_db', 'info');

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
    let [createErr, _res] = await handle(db?.schema.createTable('scanConfig', (table) => {
        // 初始化扫描配置
        logger.error(`[初始化音频扫描库]`)
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
        db.schema.hasTable(MusicTableName.music_scan_setting)
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
            logger.error(`[初始化音频播放列表库]`)
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
    // 添加默认歌单
    await db.insert({
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
    }).into(MusicTableName.music_play_list)
    logger.info('[初始化我的喜爱歌单成功]')

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
        return [null, true];
    }
    let [createErr, _res] = await handle(
        db.schema.createTable(MusicTableName.music_songs, (table) => {
            logger.error(`[初始化音频库]`)
            table.increments('id').primary()
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
    if (hasTable) {
        return [null, true];
    }
    let [createErr, _res] = await handle(
        db.schema.createTable(MusicTableName.music_play_list_songs, (table) => {
            logger.error(`[初始化歌单歌曲库]`)
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
        logger.error(`[初始化播放列表库失败] ${err.message}`)
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



// 根据扫描地址获取扫描配置
export async function getScanConfigByPath(path: string) : PromiseResult<MusicScanSetting[]>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), null]
    }
    let [err, res] = await handle(
        db.select('name', 'path', 'scanSubDir', 'isFileRepeat')
            .from(MusicTableName.music_scan_setting)
            .where('path', path)
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
    let [err, res] = await handle(
        db.select('name', 'path', 'scanSubDir', 'isFileRepeat')
            .from(MusicTableName.music_scan_setting)
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
    let [err, _res] = await handle(
        db.insert(scanConfig).into(MusicTableName.music_scan_setting)
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
        db.update(scanConfig).into(MusicTableName.music_scan_setting)
    )
    if (err) {
        err = err as Error;
    }
    return [err, true];
}

export async function deleteScanConfig(path: string) : PromiseResult<boolean>
{
    let db = loadDb(AppDbName.music_db)
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('音乐数据库初始化失败'), false]
    }
    let [err, _res] = await handle(
        db.delete().from(MusicTableName.music_scan_setting).where('path', path)
    )
    if (err) {
        err= err as Error;
    }
    return [err, true];
}
