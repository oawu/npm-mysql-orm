/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Path = require('path')
const { Type: T } = require('@oawu/helper')

let _config = {
  connect: null,
  modelsDir: null,
  queryLogDir: null,
  migrationsDir: null,
}

module.exports = {
  set connect(option) {
    if (!T.obj(option)) {
      return
    }
    _config.connect = {
      waitForConnections: true,
      connectionLimit: 5,
      host: null,
      user: null,
      password: null,
      database: null,
      port: 3306,
      waitForConnections: true,
      connectionLimit: 3,
      charset: 'utf8mb4',
      ...option
    }
  },
  set modelsDir(dir) {
    if (dir === null) {
      return _config.modelsDir = null
    }

    if (!T.str(dir)) {
      return
    }
    _config.modelsDir = Path.normalize(`${dir}${Path.sep}`)
  },
  set queryLogDir(dir) {
    if (dir === null) {
      return _config.queryLogDir = null
    }

    if (!T.str(dir)) {
      return
    }
    _config.queryLogDir = Path.normalize(`${dir}${Path.sep}`)
  },
  set migrationsDir(dir) {
    if (dir === null) {
      return _config.migrationsDir = null
    }

    if (!T.str(dir)) {
      return
    }
    _config.migrationsDir = Path.normalize(`${dir}${Path.sep}`)
  },

  get connect() {
    return _config.connect
  },
  get modelsDir() {
    return _config.modelsDir
  },
  get queryLogDir() {
    return _config.queryLogDir
  },
  get migrationsDir() {
    return _config.migrationsDir
  },
}