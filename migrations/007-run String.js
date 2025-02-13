/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = {
  up (db) {
    return 'ALTER TABLE `IndexCase` DROP INDEX `name_number_unique`;'
  },
  down: db => [
    'ALTER TABLE `IndexCase` ADD UNIQUE `name_number_unique` (`name`, `number`);'
  ]
}