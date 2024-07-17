import {db} from "./db.ts"
import {SavedMagnet} from "@/types/magnetType.ts";
import Logger from "@/util/logger.ts";
import {handle} from "@/util/promiseHandle.ts";
let logger = Logger.logger('magnet_db', 'info');
async function initData() {
    console.log('初始化数据库')
    // 1. 判断数据表是否存在
    if(!db){
        logger.error('数据库初始化失败')
        throw new Error('数据库初始化失败')
    }
    let [err, hasTable] =  await handle(db.schema.hasTable('magnets'))
    if (err) {
        err = err as Error;
        logger.error(`[数据库初始化失败] ${err.message}`)
        throw new Error('数据库初始化失败')
    }
    if (hasTable) {
        return false;
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
        throw new Error('数据库初始化失败')
    }
    logger.info('[初始化磁贴表成功]')
    return true;
}



export function findMagnetById(id: string) {
    return db?.select(
        'id',
        'x',
        'y',
        'type',
        'size'
    ).from('magnets').where('id', id)
}

export async function getMagnetList(): Promise<SavedMagnet[]> {
    initData()
    return db?.select(
        'id',
        'x',
        'y',
        'type',
        'size'
    ).from('magnets')
}

// 批量更改
export async function changeMagnets(magnetList: SavedMagnet[]) {
    await db?.transaction(async (trx) => {
        for (const magnet of magnetList) {
            await trx('magnets').where('id', magnet.id).update(magnet)
        }
    })
}

// 新增数据
export async function addMagnet(magnet: SavedMagnet) {
    initData()
    // id 字段移除

    await db?.insert(magnet).into('magnets')
}

// 删除数据
export async function deleteMagnet(magnetId: string) {
    await db?.delete().from('magnets').where('id', magnetId)
}


