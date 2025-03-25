/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const FileSystem = require('fs/promises')

const { closureOrPromise, Type: T } = require('@oawu/helper')

const Config = require('./Config.js')
const Model = require('../Model.js')

const _isDir = async (path, mode) => {
  let result = false
  try {
    await FileSystem.access(path, mode)
    const stat = await FileSystem.stat(path)
    result = stat.isDirectory()
  } catch (_) {
    result = false
  }

  return result
}
const _initMigrate = async _ => {
  const dir = Config.migrationsDir

  if (!await _isDir(dir, FileSystem.constants.R_OK)) {
    return Config.migrationsDir = null
  }
}
const _initQueryLog = async _ => {
  const dir = Config.queryLogDir

  if (!await _isDir(dir, FileSystem.constants.R_OK | FileSystem.constants.W_OK)) {
    return Config.queryLogDir = null
  }
}

const _initModel = async _ => {
  const dir = Config.modelsDir
  if (!await _isDir(dir, FileSystem.constants.R_OK)) {
    return Config.modelsDir = null
  }

  for (let key of Object.keys(Model)) {
    delete Model[key]
  }

  const _files = await FileSystem.readdir(dir)
  const files = _files.map(_file => {
    const file = /^(?<name>.*)\.js$/ig.exec(_file)
    if (file === null) {
      return null
    }

    let model = null

    try { model = require(`${dir}${file.groups.name}.js`) }
    catch (e) { model = null }

    return model
  }).filter(t => t !== null)

  for (const file of files) {
    Model(file)
  }
}

module.exports = (closure = null) => closureOrPromise(closure, async _ => {
  if (!T.obj(Config.connect)) {
    throw new Error('尚未設定 MySQL Config！')
  }

  if (!T.str(Config.connect.host)
    || !T.str(Config.connect.user)
    || !T.str(Config.connect.password)
    || !T.str(Config.connect.database)) {
    throw new Error('MySQL Config 格式有誤！')
  }

  await _initMigrate()
  await _initQueryLog()
  await _initModel()
})