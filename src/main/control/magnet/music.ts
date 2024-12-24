import {dialog} from "electron"
import { ErrorCode, RequestData, ResponseData} from "@/types/apiTypes.ts";
import Logger from "@/util/logger.ts";
import {MusicScanSetting} from "@/types/musicType.ts";
import {
    addScanConfig,
    deleteScanConfig, getPlayList,
    getScanConfig,
    getScanConfigByPath,
    updateScanConfig
} from "@/common/db/db_music.ts";
import {ResType} from "@/util/promiseHandle.ts";
import {t_gen_res, t_res_ok} from "@/main/tools/ipcRouter.ts";
let logger = Logger.logger('music', 'info');



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
