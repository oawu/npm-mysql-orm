/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = {
  up(db) {
    db = db.create('IntType', 'Int Type')
    db.attr('id').int().unsigned().notNull().autoIncrement().comment('ID')

    db.attr('id1').tinyint().unsigned().notNull().comment('tinyint unsigned')
    db.attr('id2').smallint().unsigned().notNull().comment('smallint unsigned')
    db.attr('id3').mediumint().unsigned().notNull().comment('mediumint unsigned')
    db.attr('id4').int().unsigned().notNull().comment('int unsigned')
    db.attr('id5').bigint().unsigned().notNull().comment('bigint unsigned')

    db.attr('id6').tinyint().notNull().comment('tinyint')
    db.attr('id7').smallint().notNull().comment('smallint')
    db.attr('id8').mediumint().notNull().comment('mediumint')
    db.attr('id9').int().notNull().comment('int')
    db.attr('idA').bigint().notNull().comment('bigint')

    db.attr('updateAt').datetime().notNull().default('CURRENT_TIMESTAMP').on('update', 'CURRENT_TIMESTAMP').comment('更新時間')
    db.attr('createAt').datetime().notNull().default('CURRENT_TIMESTAMP').comment('新增時間')

    db.primaryKey('id')
    return db
  },
  down: db => db.drop('IntType')
}