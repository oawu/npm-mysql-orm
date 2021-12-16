/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2020, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = {
  up: db => db.inserts('devices', [
    { name: '裝置 1' },
  ]),
  down: db => db.truncate('devices')
}