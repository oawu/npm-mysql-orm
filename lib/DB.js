/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const FileSystem = require('fs')
const DateTime   = require('./DateTime.js')
const Model      = require('../Model.js')

const logger = (error, startAt, sql) => {
  return DB.config.queryLogDir && FileSystem.writeFile(
    DB.config.queryLogDir + DateTime('date') + '.log',
    `${DateTime()} ➜ ${Date.now() - startAt}ms │ ${error ? 'FAIL' : 'OK'} ➜ ${sql}${error ? ` │ ${error.message || error.stack}` : ''}\n`,
    {flag: 'a+', encoding: 'utf8'}, _ => {}), error
}

const execute = (sql, closure) => {
  const startAt = Date.now()

  DB.pool.getConnection((error, connection) => !error
  ? connection.query('' + sql, (error, data) => connection.release(!error
    ? closure(logger(null, startAt, sql + ''), data)
    : closure(logger(error, startAt, sql + ''), null)))
  : closure(logger(error, startAt, sql + ''), null))
}

const DB = function(sql, closure = null) {
  if (DB.config.connect === null) {
    const error = new Error('尚未設定 MySQL Config！')
    return closure
      ? closure(error, null)
      : new Promise((_, reject) => reject(error))
  }

  if (DB.config.connect.host === undefined || DB.config.connect.user === undefined || DB.config.connect.password === undefined || DB.config.connect.database === undefined) {
    const error = new Error('MySQL Config 格式有誤！')
    return closure
      ? closure(error, null)
      : new Promise((_, reject) => reject(error))
  }

  if (DB.pool === null) {
    const mysql = require('mysql')
    DB.pool = mysql.createPool(DB.config.connect);
  }

  if (DB.pool === null) {
    const error = new Error('無法建立 Pool 連線機制！')
    return closure
      ? closure(error, null)
      : new Promise((_, reject) => reject(error))
  }

  return closure
    ? execute(sql, closure)
    : new Promise((resolve, reject) => execute(sql, (error, data) => error
      ? reject(error)
      : resolve(data)))
}

DB.pool = null

DB.config = {
  connect: null,

  get migrations () { return this.migration._migrations },

  queryLogDir: null,

  migration: {
    _migrations: [],
    set dir (dir) {
      return this._migrations = FileSystem.readdirSync(dir)
        .map(file => {
          file = /^(?<version>[0-9]+)\-(?<name>.*)\.js$/g.exec(file)
          if (file === null) return null
          let migrate = null
          try { migrate = require(dir + file.groups.version + '-' + file.groups.name + '.js') }
          catch (e) { migrate = null }
          return migrate && { version: parseInt(file.groups.version, 10), title: file.groups.name, up: migrate.up, down: migrate.down, }
        })
        .filter(t => t !== null)
        .sort((a, b) => a.version - b.version), this
    }
  },
  model: {
    set dir (dir) {
      for (let key of Object.keys(Model))
        delete Model[key]

      return FileSystem.readdirSync(dir)
        .map(file => {
          file = /^(?<name>.*)\.js$/g.exec(file)
          if (file === null) return null
          let model = null
          try { model = require(dir + file.groups.name + '.js') }
          catch (e) { model = null }
          return model && model
        })
        .filter(t => t !== null)
        .forEach(model => Model(model)), this
    }
  }
}

DB.close = _ => DB.pool && DB.pool.end()

DB.sql = (sql, closure = null) => DB(sql, closure)

module.exports = DB
