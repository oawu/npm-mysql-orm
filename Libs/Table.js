/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { closureOrPromise, Type: T, Json } = require('@oawu/helper')

const DB = require('./DB.js')
const Model = require('./Model.js')
const Builder = require('./Builder.js')
const DateTime = require('./DateTime.js')

const _columnFormat = _infos => {
  const row = {}
  for (let key in _infos) {
    row[key.toLowerCase()] = _infos[key]
  }

  const match = /^(?<type>[A-Za-z0-9_]+)(\((?<length>.*)\))?( (?<infos>.*))?/g.exec(row.type)

  let type = match.groups && match.groups.type
    ? match.groups.type
    : row.type
  const length = match.groups && match.groups.length
    ? match.groups.length
    : null
  const infos = match.groups && match.groups.infos
    ? match.groups.infos.split(' ').map(info => info.trim()).filter(info => info !== '')
    : []

  if (type == 'timestamp') {
    type = 'datetime'
  }

  if (type == 'integer') {
    type = 'int'
  }

  const val = {
    type,
    infos,
    field: row.field,
    nullable: row.null === 'YES',
    primary: row.key === 'PRI',
    auto: row.extra === 'auto_increment',
    default: row.default,
  }

  if (type == 'enum') {
    val.vals = length.split(',').map(t => t.trim().replace(/^'(.*)'$/g, '$1').replace(/'{2}/g, '\''))
  }

  if (type == 'varchar' || type == 'int') {
    val.length = parseInt(length, 10)
  }

  if (type == 'decimal') {
    val.length = length.split(',')
      .map(t => t.trim())
      .filter(t => t !== '')
      .map(t => parseInt(t, 10))
  }

  return val
}

const Table = function (model, closure) {
  if (!(this instanceof Table)) {
    return new Table(model, closure)
  }

  this.model = model
  this.columns = {}
  this.primaries = []

  DB.sql(`SHOW COLUMNS FROM ${Builder.quote(this.name)};`, data => {
    if (T.err(data)) {
      return closure(data)
    }

    for (let row of data) {
      row = _columnFormat(row)
      this.columns[row.field] = row

      if (row.primary) {
        this.primaries.push(row.field)
      }
    }

    return closure(this)
  })
}

Object.defineProperty(Table.prototype, 'name', {
  get() {
    return this.model.table === undefined
      ? this.model.name
      : this.model.table
  }
})

const _instances = new Map()

Table.instance = (model, closure = null) => {
  if (_instances.has(model)) {
    return closureOrPromise(closure, _instances.get(model))
  }

  return closureOrPromise(closure, new Promise((resolve, reject) => Table(model, data => {
    if (T.err(data)) {
      return reject(data)
    }

    _instances.set(model, data)
    resolve(data)
  })))
}

Table.prototype.attrsToStrings = function (attrs) {
  for (let name in attrs) {

    if (this.columns[name] !== undefined && this.columns[name].type == 'json') {
      attrs[name] = Json.toString(attrs[name])
    }

    if (attrs[name] instanceof DateTime) {
      attrs[name] = attrs[name].value
    }
  }

  return attrs;
}

Table.prototype.insert = function (model, attrs, closure = null) {
  attrs = this.attrsToStrings(attrs)

  if (!Object.keys(attrs).length) {
    return closureOrPromise(closure, model)
  }

  const builder = Builder(this.model, 'insert').attrs(attrs)

  return closureOrPromise(closure, async _ => {
    const data = await DB.sql(builder)

    model.id = data.insertId
    model.$.isNew = false
    model.$.dirties = []

    return model
  })
}

Table.prototype.update = function (model, attrs, primaries, closure = null) {
  attrs = this.attrsToStrings(attrs)

  if (!Object.keys(attrs).length) {
    return closureOrPromise(closure, model)
  }

  const builder = Builder(this.model, 'update').attrs(attrs)

  for (let key in primaries) {
    builder.where(key, primaries[key])
  }

  return closureOrPromise(closure, async _ => {
    await DB.sql(builder)
    model.$.dirties = []
    return model
  })
}

Table.prototype.delete = function (model, primaries, closure = null) {
  const builder = Builder(this.model, 'delete')

  for (let key in primaries) {
    builder.where(key, primaries[key])
  }

  return closureOrPromise(closure, async _ => {
    await DB.sql(builder)
    return model
  })
}

Table.prototype.find = function (builder, closure = null) {
  return closureOrPromise(closure, async _ => {
    const data = await DB.sql(builder)
    return data.map(row => Model(this, row))
  })
}

module.exports = Table
