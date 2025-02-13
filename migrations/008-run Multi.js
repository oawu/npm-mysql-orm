/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = {
  up (db) {
    const tableA = db.create('TestA', 'Test A')
    const tableB = db.create('TestB', 'Test B')

    tableA.attr('id').int().unsigned().notNull().autoIncrement().comment('ID')
    tableA.attr('updateAt').datetime().notNull().default('CURRENT_TIMESTAMP').on('update', 'CURRENT_TIMESTAMP').comment('更新時間')
    tableA.attr('createAt').datetime().notNull().default('CURRENT_TIMESTAMP').comment('新增時間')
    tableA.primaryKey('id')

    tableB.attr('id').int().unsigned().notNull().autoIncrement().comment('ID')
    tableB.attr('updateAt').datetime().notNull().default('CURRENT_TIMESTAMP').on('update', 'CURRENT_TIMESTAMP').comment('更新時間')
    tableB.attr('createAt').datetime().notNull().default('CURRENT_TIMESTAMP').comment('新增時間')
    tableB.primaryKey('id')

    return [tableA, tableB]
  },
  down: db => [
    db.drop('TestA'),
    db.drop('TestB'),
  ]
}