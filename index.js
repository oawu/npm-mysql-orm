/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */
const FileSystem = require('fs')
const DB       = require('./lib/DB.js')
const Model    = require('./Model.js')
const Migrate  = require('./Migrate.js')

const access = (dir, permission = FileSystem.constants.R_OK) => {
  try { return FileSystem.accessSync(dir, permission), true }
  catch (error) { return false }
}

module.exports = {
  DB,
  Model,
  Migrate,
  Config: {
    connect (val)       { return DB.config.connect = { waitForConnections: true, connectionLimit: 5, ...val }, this },
    modelsDir (dir)     { return access(dir) && !!FileSystem.statSync(dir).isDirectory() && (DB.config.model.dir = dir), this },
    migrationsDir (dir) { return access(dir) && !!FileSystem.statSync(dir).isDirectory() && (DB.config.migration.dir = dir), this },
    queryLogDir (dir)   { return DB.config.queryLogDir = access(dir, FileSystem.constants.R_OK | FileSystem.constants.W_OK) && !!FileSystem.statSync(dir).isDirectory() ? dir : null, this },
  }
}
