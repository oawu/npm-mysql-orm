/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const DB           = require('./DB.js')
const Builder      = require('./Builder.js')
const { quoteName1, columnFormat, attrsToStrings } = require('./Func.js')

const Table = function(model, closure) {
  if (!(this instanceof Table)) return new Table(model, closure)

  this.model = model
  this.columns = {}
  this.primaries = []
  
  DB.sql(`SHOW COLUMNS FROM ${quoteName1(this.name)};`, (error, rows) => {
    if (error) return closure(error, null)
    for (let row of rows) {
      row = columnFormat(row)
      this.columns[row.field] = row
      row.primary && this.primaries.push(row.field)
    }

    return closure(null, this)
  })
}

Object.defineProperty(Table.prototype, 'name', { get () { return this.model.table === undefined ? this.model.name :  this.model.table } })

const instances = new Map()

Table.instance = (model, closure = null) => {
  if (instances.has(model))
    return closure
      ? closure(null, instances.get(model))
      : new Promise((resolve, reject) => resolve(instances.get(model)))

  return closure
    ? Table(model, (error, table) => error
      ? closure(error, null)
      : closure(null, table, instances.set(model, table)))
    : new Promise((resolve, reject) => Table(model, (error, table) => error
      ? reject(error)
      : resolve(table, instances.set(model, table))))
}

Table.prototype.insert = function(model, attrs, closure = null) {
  attrs = attrsToStrings(this, attrs)

  if (!Object.keys(attrs).length)
    return closure
      ? closure(null, model)
      : new Promise((resolve, reject) => resolve(model))
  
  const builder = Builder(this.model, 'insert').attrs(attrs)

  return closure
    ? DB.sql(builder, (error, data) => error ? closure(error, null) : closure(null, model, model.id = data.insertId, model.$.isNew = false, model.$.dirties = []))
    : new Promise((resolve, reject) => DB.sql(builder, (error, data) => error ? reject(error) : resolve(model, model.id = data.insertId, model.$.isNew = false, model.$.dirties = [])))
}

Table.prototype.update = function(model, attrs, primaries, closure = null) {
  attrs = attrsToStrings(this, attrs)

  if (!Object.keys(attrs).length)
    return closure
      ? closure(null, model)
      : new Promise((resolve, reject) => resolve(model))

  const builder = Builder(this.model, 'update').attrs(attrs)

  for (let key in primaries)
    builder.where(key, primaries[key])

  return closure
    ? DB.sql(builder, (error, data) => error ? closure(error, null) : closure(null, model, model.$.dirties = []))
    : new Promise((resolve, reject) => DB.sql(builder, (error, data) => error ? reject(error) : resolve(model, model.$.dirties = [])))
}

Table.prototype.delete = function(model, primaries, closure = null) {
  const builder = Builder(this.model, 'delete')

  for (let key in primaries)
    builder.where(key, primaries[key])

  return closure
    ? DB.sql(builder, (error, data) => error ? closure(error, null) : closure(null, model))
    : new Promise((resolve, reject) => DB.sql(builder, (error, data) => error ? reject(error) : resolve(model)))
}

Table.prototype.find = function(builder, closure = null) {
  const Model = require('./Model.js')
  return closure
    ? DB.sql(builder, (error, data) => error ? closure(error, null) : closure(null, data.map(row => Model(this, row))))
    : new Promise((resolve, reject) => DB.sql(builder, (error, data) => error ? reject(error) : resolve(data.map(row => Model(row)))))
}

module.exports = Table
