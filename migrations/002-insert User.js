/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, Ginkgo
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

module.exports = {
  up: db => db.inserts('User', [
    { name: 'OA', sex: 'male', height: 170.0, bio: '先寫別人會寫而不想寫的程式，以後才可以寫別人想寫而寫不出來的程式。' },
  ]),
  down: db => db.truncate('User')
}