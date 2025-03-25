/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { Config, Model, DB, Init, Migrate } = require('./index.js')
const { Type: T } = require('@oawu/helper')
const path = require('path')

// 設定連線方式
Config.connect = {
  host: "db-mysql-8.3",
  user: "root",
  password: "1234",
  database: "node-orm",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 3,
  charset: 'utf8mb4'
}

// // Migration 檔案位置
Config.migrationsDir = __dirname + path.sep + 'Migrations' + path.sep

// Model 檔案位置
Config.modelsDir = __dirname + path.sep + 'Models' + path.sep

// // Log 檔案位置
Config.queryLogDir = __dirname + path.sep + 'Logs' + path.sep

Init()
  .then(async _ => {
    await require('./test-Migration.js')()
    await require('./test-Model.js')()
  })
  .catch(_ => {
    console.error('b', _);
  })
  .finally(async _ => {
    await DB.close()
  })
