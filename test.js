/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Queue = require('@oawu/queue')
const { Config, Model, DB } = require('./index.js')
const path = require('path')

// 設定連線方式
Config.connect({
    host: "127.0.0.1",
    user: "root",
    password: "1234",
    database: "php-orm",
    port: 3306,
    waitForConnections : true,
    connectionLimit : 3,
    charset: 'utf8mb4'
  })

// Migration 檔案位置
Config.migrationsDir(__dirname + path.sep + 'migrations' + path.sep)

// Model 檔案位置
Config.modelsDir(__dirname + path.sep + 'models' + path.sep)

// Log 檔案位置
Config.queryLogDir(__dirname + path.sep + 'logs' + path.sep)

// 測試
require('./test-Migration.js')
  // .enqueue(next => require('./test-Model-1.js')
    .enqueue(next => require('./test-Model-2.js')
      .enqueue(next => DB.close()))
    // )
