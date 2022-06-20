/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { modify } = require('./Func.js')
const DateTime   = require('./DateTime.js')

const CREATE_AT = 'createAt'
const UPDATE_AT = 'updateAt'

const attrDefaults = (table, attrs, full = true) => {
  const columns = table.columns

  if (columns[CREATE_AT] !== undefined && attrs[CREATE_AT] === undefined) {
    attrs[CREATE_AT] = DateTime(columns[CREATE_AT].type)
  }

  if (columns[UPDATE_AT] !== undefined && attrs[UPDATE_AT] === undefined)
    attrs[UPDATE_AT] = DateTime(columns[UPDATE_AT].type)

  const newAttrs = {}

  for (let key in columns) {
    if (!(full || attrs[$key] !== undefined))
      continue

    if (attrs[key] === undefined)
      attrs[key] = columns[key].default

    if (!columns[key].nullable && !columns[key].auto && (attrs[key] === undefined || attrs[key] === null))
      throw new Error(`「${key}」不可以為 NULL`)
    
    newAttrs[key] = attrs[key] !== undefined
      ? columns[key].type == 'json'
        ? stringJson(attrs[key])
        : attrs[key]
      : newAttrs[key] == null
  }

  return newAttrs
}

const Model = function (table, row, isNew = false) {
  const object = new table.model(row)

  const $ = {
    table, isNew, attrs: new Map(), dirties: [],
    get primaries () {
      const primaries = {}
      for (let key of table.primaries)
        if (this.attrs.has(key))
          primaries[key] = this.attrs.get(key)
      return primaries
    }
  }

  Object.defineProperty(object, '$', { get () { return $ } })

  if (isNew)
    row = attrDefaults(table, row)

  for (let name in row) {
    const val = table.columns[name] !== undefined
      ? modify.init(table.columns[name], row[name])
      : row[name]

    $.attrs.set(name, val)

    Object.defineProperty(object, name, {
      enumerable: true,
      get () { return $.attrs.get(name) },
      set (val) {
        return $.dirties.push(name),
          $.attrs.set(name, modify.update(table.columns[name],
          $.attrs.get(name), val))
      }
    })
  }

  return object
}

Model.prototype.save = function(closure) {
  return this.$.isNew
    ? this.insert(closure)
    : this.update(closure)
}

Model.prototype.insert = function(closure) {
  const attrs = {}

  for (let key in this.$.table.columns)
    attrs[key] = this[key]

  return this.$.table.insert(this, attrs, closure)
}

Model.prototype.update = function(closure) {
  if (!Object.keys(this.$.primaries).length)
    return closure
      ? closure(new Error(`更新資料失敗，錯誤原因：找不到 Primary Key`), null)
      : new Promise((resolve, reject) => reject(new Error(`更新資料失敗，錯誤原因：找不到 Primary Key`)))
  
  if (!this.$.dirties.length)
    return closure
      ? closure(null, this)
      : new Promise((resolve, reject) => resolve(this))
  
  // update_at
  if (this.$.table.columns[UPDATE_AT] !== undefined && this[UPDATE_AT] !== undefined && !this.$.dirties.includes(UPDATE_AT))
    this[UPDATE_AT] = DateTime(this.$.table.columns[UPDATE_AT].type)
    
  const attrs = {}
  for (let dirty of this.$.dirties)
    attrs[dirty] = this[dirty]

  return this.$.table.update(this, attrs, this.$.primaries, closure)
}

Model.prototype.delete = function(closure) {
  if (!Object.keys(this.$.primaries).length)
    return closure
      ? closure(new Error(`更新資料失敗，錯誤原因：找不到 Primary Key`), null)
      : new Promise((resolve, reject) => reject(new Error(`更新資料失敗，錯誤原因：找不到 Primary Key`)))

  return this.$.table.delete(this, this.$.primaries, closure)
}

module.exports = Model
