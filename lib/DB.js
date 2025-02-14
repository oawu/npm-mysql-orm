/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const mysql      = require('mysql')
const FileSystem = require('fs/promises')

const { closureOrPromise, Type: T } = require('@oawu/helper')

const Config     = require('./Config.js')
const DateTime   = require('./DateTime.js')

const _logger = (data, startAt, sql, vals) => {
  if (!Config.queryLogDir) {
    return data
  }

  const file = `${Config.queryLogDir}${DateTime('date')}.log`
  const text = `${DateTime('time')} │ ${Date.now() - startAt}ms │ ${data instanceof Error ? 'x' : 'v'} │ ${sql} [${vals}]${data instanceof Error ? ` │ ${data.message || data.stack}` : ''}\n`
  FileSystem.writeFile(file, text, { flag: 'a+', encoding: 'utf8' })
  return data
}

let _pool = null

module.exports = {
  sql: (sql, closure = null) => closureOrPromise(closure, done => {
    const startAt = Date.now()
    const sqlStr = `${sql}`.trim()
    const vals = sql.vals || []

    if (!T.neStr(sqlStr)) {
      return done(_logger(null, startAt, '', []))
    }

    if (_pool === null) {
      if (!T.obj(Config.connect)) {
        return done(_logger(new Error('尚未設定 MySQL Config！'), startAt, sqlStr, vals.join(', ')))
      }

      if (!T.str(Config.connect.host) || !T.str(Config.connect.user) || !T.str(Config.connect.password) || !T.str(Config.connect.database)) {
        return done(_logger(new Error('MySQL Config 格式有誤！'), startAt, sqlStr, vals.join(', ')))
      }

      _pool = mysql.createPool(Config.connect);
    }

    if (_pool === null) {
      return done(_logger(new Error('無法建立 Pool 連線機制！'), startAt, sqlStr, vals.join(', ')))
    }

    _pool.getConnection((error, connection) => error
      ? done(_logger(error, startAt, sqlStr, vals.join(', ')))
      : connection.query(sqlStr, vals, (error, data) => {

        connection.release()

        done(_logger(error
          ? error
          : data, startAt, sqlStr, vals.join(', ')))
      }))
  }),
  close: (closure = null) => closureOrPromise(closure, done => _pool
    ? _pool.end(done)
    : done()),
}
