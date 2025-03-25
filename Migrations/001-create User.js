/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = {
  up(db) {
    db = db.create('User', '使用者')
    db.attr('id').int().unsigned().notNull().autoIncrement().comment('ID')

    db.attr('name').varchar(190).collate('utf8mb4_unicode_ci').notNull().comment('名稱')
    db.attr('sex').enum('male', 'female').collate('utf8mb4_unicode_ci').default(null).comment('性別')
    db.attr('height').decimal(5, 2).unsigned().default(null).comment('身高')
    db.attr('bio').text().collate('utf8mb4_unicode_ci').notNull().comment('個人簡歷')

    db.attr('updateAt').datetime().notNull().default('CURRENT_TIMESTAMP').on('update', 'CURRENT_TIMESTAMP').comment('更新時間')
    db.attr('createAt').datetime().notNull().default('CURRENT_TIMESTAMP').comment('新增時間')

    db.primaryKey('id')
    return db
  },
  down: db => db.drop('User')
}