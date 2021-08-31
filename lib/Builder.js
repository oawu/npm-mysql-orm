/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { quoteName1, quoteName2, attrsToStrings } = require('./Func.js')

const Builder = function(proto, type = 'select') {
  if (!(this instanceof Builder)) return new Builder(proto, type)
  this.type = type
  this.proto = proto
  this.option = {}
}

Object.defineProperty(Builder.prototype, 'name', { get () { return this.proto.name } })

Builder.prototype._where  = function(...options) {
  if (!options.length) return ''

  const el0 = options.shift()

  if (typeof el0 == 'number') return `${quoteName1(this.name)}.${quoteName1('id')} = ${quoteName2(el0)}`

  if (typeof el0 == 'string') {
    let el1 = options.shift()

    options.length == 0 && Array.isArray(el1) && options.push(el1) && (el1 = 'IN')
    if (options.length == 0) return `${quoteName1(this.name)}.${quoteName1(el0)} = ${quoteName2(el1)}`

    const el2 = options.shift()
    return `${quoteName1(this.name)}.${quoteName1(el0)} ${el1} ${Array.isArray(el2) ? `(${el2.map(quoteName2).join(',')})` : quoteName2(el2)}`
  }
  
  if (Array.isArray(el0)) return `${quoteName1(this.name)}.${quoteName1('id')} IN (${el0.map(quoteName2).join(',')})`

  if (typeof el0 == 'object' && el0 !== null && !Array.isArray(el0)) {
    const wheres = []

    for (let key in el0)
      wheres.push(Array.isArray(el0[key]) ? `${quoteName1(this.name)}.${quoteName1(key)} IN (${el0[key].map(quoteName2).join(',')})` : `${quoteName1(this.name)}.${quoteName1(key)} = ${quoteName2(el0[key])}`)

    return (wheres.length > 1 ? wheres.map(t => `(${t})`) : wheres).join(' AND ')
  }

  return ''
}

Builder.prototype.andWhere  = function(...options) {
  this.option.where = this.option.where === undefined
    ? this._where(...options)
    : `(${this.option.where}) AND (${this._where(...options)})`

  return this
}

Builder.prototype.orWhere  = function(...options) {
  this.option.where = this.option.where === undefined
    ? this._where(...options)
    : this.option.where = `(${this.option.where}) OR (${this._where(...options)})`

  return this
}

Builder.prototype.where  = function(...options) {
  return this.andWhere(...options)
}

Builder.prototype.select = function(...options) {
  let option = options.shift()

  if (option === undefined)
    return this

  if (typeof option == 'string') {
    option = option.search(/,/g) == -1 ? [option] : option.split(',').map(t => t.trim())
    option = (options.length ? [...option, ...options] : option).filter(t => t.length)
  }

  if (typeof option != 'object') return this

  Array.isArray(option) || (option = [option])

  const as = obj => {
    let tmps = []
    for (let key in obj)
      tmps.push(`${key} AS ${obj[key]}`)
    return tmps
  }

  const select = []

  for (let key in option)
    if (typeof option[key] == 'string')
      select.push(`${option[key]}`)

    else if (typeof option[key] == 'object')
      select.push(...as(option[key]))

  if (select.length)
    this.option.select = select.join(',')

  return this
}

Builder.prototype.order  = function(...options) {
  let option = options.shift()

  if (option === undefined)
    return this

  if (typeof option == 'string') {
    option = option.search(/,/g) == -1 ? [option] : option.split(',').map(t => t.trim())
    option = (options.length ? [...option, ...options] : option).filter(t => t.length)
  }
  
  if (typeof option != 'object')
    return this

  Array.isArray(option) || (option = [option])
  
  const join = obj => {
    let tmps = []
    for (let key in obj)
      tmps.push(`${quoteName1(this.name)}.${quoteName1(key)} ${obj[key]}`)
    return tmps
  }

  const order = []

  for (let key in option)
    if (typeof option[key] == 'string') {
      const [t1 = null, t2 = 'asc'] = option[key].split(' ').map(t => t.trim()).filter(t => t.length)

      t1 === null || order.push(`${quoteName1(this.name)}.${quoteName1(t1)} ${t2}`)
    }

    else if (typeof option[key] == 'object')
      order.push(...join(option[key]))

  if (order.length)
    this.option.order = order.join(',')

  return this
}

Builder.prototype.limit  = function(option) { return this.option.limit  = option, this }

Builder.prototype.offset = function(option) { return this.option.offset = option, this }

Builder.prototype.group  = function(option) { return this.option.group  = option, this }

Builder.prototype.having = function(option) { return this.option.having = option, this }

Builder.prototype.join   = function(name, primary, foreign, type = 'INNER') { return this.option.join = `${type} JOIN ${quoteName1(name)} ON ${quoteName1(name)}.${quoteName1(primary)}=${quoteName1(this.name)}.${quoteName1(foreign)}`, this }

Builder.prototype.update = function(attrs, closure = null) {
  const DB = require('./DB.js')

  const execute = (table, attrs, closure) => Object.keys(attrs = attrsToStrings(table, attrs)).length
    ? DB.sql(this.attrs(attrs), (error, { affectedRows }) => error
      ? closure(error, null)
      : closure(null, affectedRows))
    : closure(null, 0)

  return this.type = 'update', closure
    ? require('./Table.js').instance(this.proto, (error, table) => error
      ? closure(error, null)
      : execute(table, attrs, closure))
    : new Promise((resolve, reject) => require('./Table.js').instance(this.proto, (error, table) => error
      ? reject(error)
      : execute(table, attrs, ((error, affectedRows) => error
        ? reject(error)
        : resolve(affectedRows)))))
}

Builder.prototype.delete = function(closure = null) {
  const DB = require('./DB.js')

  return this.type = 'delete', closure
    ? DB.sql(this, (error, { affectedRows }) => error ? closure(error, null) : closure(null, affectedRows))
    : new Promise((resolve, reject) => DB.sql(this._delete(), (error, { affectedRows }) => error ? reject(error) : resolve(affectedRows)))
}

Builder.prototype.find = function(closure = null, isOne = false) {
  if (typeof closure == 'number')
    this.where(closure), closure = null

  if (typeof closure == 'boolean')
    isOne = closure, closure = null

  return closure
    ? require('./Table.js').instance(this.proto, (error, table) => error
      ? closure(error, null)
      : table.find(this, (error, data) => error
        ? closure(error, null)
        : closure(null, isOne ? data.shift() || null : data)))
    : new Promise((resolve, reject) => require('./Table.js').instance(this.proto, (error, table) => error
      ? reject(error)
      : table.find(this, (error, data) => error
        ? reject(error)
        : resolve(isOne ? data.shift() || null : data))))
}

Builder.prototype.count = function(closure = null) {
  return closure
    ? this.select({ 'count(*)': 'count' }).group(undefined).find((error, { count = 0 }) => error
      ? closure(error, null)
      : closure(null, count), true)
    : new Promise((resolve, reject) => this.select({ 'count(*)': 'count' }).group(undefined).find((error, { count = 0 }) => error
      ? reject(error, null)
      : resolve(count), true))
}

Builder.prototype.truncate = function(closure = null) {
  return closure
    ? require('./DB.js').sql(`TRUNCATE TABLE ${quoteName1(this.name)};`, closure)
    : new Promise((resolve, reject) => require('./DB.js').sql(`TRUNCATE TABLE ${quoteName1(this.name)};`, (error, data) => error
      ? reject(error)
      : resolve(data)))
}

Builder.prototype.one = function(closure = null) { return this.find(closure, true) }

Builder.prototype.all = function(closure = null) { return this.find(closure, false) }

Builder.prototype.attrs = function(attrs) { return this.option.attrs = attrs, this }

Builder.prototype._insertString = function() {
  const keys = [], vals = []

  for (let key in this.option.attrs) {
    keys.push(`${quoteName1(key)}`)
    vals.push(`${quoteName2(this.option.attrs[key])}`)
  }

  const strs = ['INSERT']
  strs.push('INTO')
  strs.push(quoteName1(this.name))
  strs.push(`(${keys.join(',')})`)
  strs.push('VALUES')
  strs.push(`(${vals.join(',')})`)

  return `${strs.join(' ')};`
}

Builder.prototype._updateString = function() {
  const sets = []

  for (let key in this.option.attrs)
    sets.push(`${quoteName1(this.name)}.${quoteName1(key)}=${quoteName2(this.option.attrs[key])}`)

  const strs = ['UPDATE']
  strs.push(quoteName1(this.name))
  strs.push('SET')
  strs.push(sets.join(', '))

  this.option.where  !== undefined && strs.push('WHERE '    + this.option.where)
  return `${strs.join(' ')};`
}

Builder.prototype._deleteString = function() {
  const strs = ['DELETE'];
  strs.push('FROM')
  strs.push(quoteName1(this.name))

  this.option.where  !== undefined && strs.push('WHERE '    + this.option.where)
  this.option.order  !== undefined && strs.push('ORDER BY ' + this.option.order)

  const limit  = this.option.limit  === undefined ? 0 : parseInt(this.option.limit, 10)
  const offset = this.option.offset === undefined ? 0 : parseInt(this.option.offset, 10)

  if (limit || offset) strs.push(`LIMIT ${offset},${limit}`)

  return `${strs.join(' ')};`
}

Builder.prototype._selectString = function() {
  const strs = ['SELECT']

  strs.push(this.option.select === undefined ? `${quoteName1(this.name)}.*` : this.option.select)
  strs.push('FROM')
  strs.push(quoteName1(this.name))

  this.option.joinIn !== undefined && strs.push(this.option.join)
  this.option.where  !== undefined && strs.push('WHERE '    + this.option.where)
  this.option.group  !== undefined && strs.push('GROUP BY ' + this.option.group)
  this.option.having !== undefined && strs.push('HAVING '   + this.option.having)
  this.option.order  !== undefined && strs.push('ORDER BY ' + this.option.order)

  const limit  = this.option.limit  === undefined ? 0 : parseInt(this.option.limit, 10)
  const offset = this.option.offset === undefined ? 0 : parseInt(this.option.offset, 10)

  if (limit || offset) strs.push(`LIMIT ${offset},${limit}`)

  return `${strs.join(' ')};`
}

Builder.prototype.toString = function() {
  if (this.type == 'select')
    return this._selectString()
  if (this.type == 'update')
    return this._updateString()
  if (this.type == 'insert')
    return this._insertString()
  if (this.type == 'delete')
    return this._deleteString()
  
  return ';'
}

module.exports = Builder
