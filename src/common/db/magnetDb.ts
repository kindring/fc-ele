import {loadDb} from "./db.ts"
import {SavedMagnet} from "@/types/magnetType.ts";
import Logger from "@/util/logger.ts";
import {handle, PromiseResult} from "@/util/promiseHandle.ts";
import {AppDbName} from "@/types/appConfig.ts";
let logger = Logger.logger('magnet_db', 'info');
export async function initMagnetData() : Promise<[Error | null, boolean]> {
    console.log('初始化磁贴数据库')
    let db = loadDb(AppDbName.magnet_db)
    // 1. 判断数据表是否存在
    if(!db){
        logger.error('数据库初始化失败')
        return [new Error('数据库初始化失败'),false];
    }
    let [err, hasTable] =  await handle(db.schema.hasTable('magnets'))
    if (err) {
        err = err as Error;
        logger.error(`[数据库初始化失败] ${err.message}`)
        return [err, false];
    }
    if (hasTable) {
        return [null, false];
    }
    let [createErr, _res] =  await handle(db?.schema.createTable('magnets', (table) => {
        logger.error(`[初始化磁贴表]`)
        table.increments('id').primary()
        table.integer('x')
        table.integer('y')
        table.string('type')
        table.string('size')

    }))
    if (createErr) {
        createErr = createErr as Error;
        logger.error(`[初始化磁贴表失败] ${createErr.message}`)
        return [createErr, false];
    }
    logger.info('[初始化磁贴表成功]')
    return [null, true];
}
initMagnetData()



export function findMagnetById(id: string) {
    let db = loadDb(AppDbName.magnet_db)
    return db?.select(
        'id',
        'x',
        'y',
        'type',
        'size'
    ).from('magnets').where('id', id)
}

export async function getMagnetList(): Promise<[Error | null, SavedMagnet[]]> {
    let db = loadDb(AppDbName.magnet_db)
    if (!db) {
        return [new Error('数据库初始化失败'), []];
    }
    let [err, savedMagnet] = await handle(db?.select(
        'id',
        'x',
        'y',
        'type',
        'size'
    ).from('magnets'))
    if (err) {
        err = err as Error;
        logger.error(`[获取磁贴列表失败] ${err.message}`)
        return [err, []];
    }
    return [err, savedMagnet as SavedMagnet[]];
}

// 批量更改
export async function changeMagnets(magnetList: SavedMagnet[]): PromiseResult<boolean> {
    let db = loadDb(AppDbName.magnet_db)
    if (!db) {
        return [new Error('数据库初始化失败'), false];
    }
    let transaction = await db.transaction(async (trx) => {
        let flag = true
        for (const magnet of magnetList) {
            let changeMagnet = {
                id: magnet.id,
                size: magnet.size,
                type: magnet.type,
                x: magnet.x,
                y: magnet.y,
            }
            await trx('magnets').where('id', changeMagnet.id).update(changeMagnet)
        }
        return flag;
    })



    return [null, transaction]
}

// 新增数据
export async function addMagnet(magnet: SavedMagnet) : PromiseResult<boolean> {
    let db = loadDb(AppDbName.magnet_db)
    if (!db) {
        return [new Error('数据库初始化失败'), false];
    }
    // id 字段移除
    let addMagnet = {
        size: magnet.size,
        type: magnet.type,
        x: magnet.x,
        y: magnet.y,
    }
    db.insert(addMagnet).into('magnets')
    return [null, true]

}

// 删除数据
export async function db_deleteMagnet(magnetId: string): PromiseResult<boolean> {
    // console.log(`删除磁贴: ${magnetId}`)
    let db = loadDb(AppDbName.magnet_db)
    if (!db) {
        return [new Error('数据库初始化失败'), false];
    }
    logger.info(`删除磁贴: ${magnetId}`)
    db?.delete().from('magnets').where('id', magnetId)
    return [null, true]
}


