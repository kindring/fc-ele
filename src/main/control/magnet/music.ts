import {dialog} from "electron"
import {ApiType, ErrorCode, RequestData, ResponseData} from "@/types/apiTypes.ts";
import Logger from "@/util/logger.ts";
import {MusicScanSetting} from "@/types/musicType.ts";
import {addScanConfig, getScanConfig, getScanConfigByPath, updateScanConfig} from "@/common/db/db_music.ts";
import {ResType} from "@/util/promiseHandle.ts";
import {t_gen_res, t_res_ok} from "@/main/tools/ipcRouter.ts";
let logger = Logger.logger('music', 'info');



export async function c_fetchPlayList(requestData: RequestData<null>)
{
    let responseData: ResponseData<any>
    responseData = {
        type: ApiType.res,
        code: ErrorCode.success,
        callId: requestData.callId,
        action: requestData.action,
        msg: '暂无歌单',
        data: [],
    }

    return responseData;
}

/**
 * 选择扫描目录
 * @param requestData
 */
export async function c_scanMusicSelect(requestData: RequestData<string>): Promise<ResponseData<string>>
{
    let defaultPath = requestData.data;
    logger.info(`select scan dir`);
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
    let [err, scanSettingList] = await getScanConfigByPath(scanSetting.path)
    if (err) {
        logger.error(`[获取扫描设置列表失败] ${err.message}`)
        return t_gen_res(requestData, ErrorCode.db, '获取扫描设置列表失败', false)
    }
    scanSettingList = scanSettingList as MusicScanSetting[];
    if (scanSettingList.length> 0)
    {
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