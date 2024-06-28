import {db} from "./db.ts"
import {SavedMagnet} from "@/types/magnetType.ts";

function initData() {
    // 1. 判断数据表是否存在
    db?.schema.createTable('magnets', (table) => {
        table.string('id').primary()
        table.integer('x')
        table.integer('y')
        table.string('type')
        table.string('size')
    })
}
initData();


export async function getMagnetList(): Promise<SavedMagnet[]> {
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
    await db?.insert(magnet).into('magnets')
}

// 删除数据
export async function deleteMagnet(magnetId: string) {
    await db?.delete().from('magnets').where('id', magnetId)
}


