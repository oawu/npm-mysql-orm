/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { closureOrPromise, Type: T } = require('@oawu/helper')

const DB = require('./DB.js')

const _quote = name => typeof name == 'string' && !(name[0] === '`' || name[name.length - 1] === '`') ? '`' + name + '`' : name

const _where = (table, ...options) => {
  // _where()

  // _where(null)
  // _where(1)
  // _where('a')
  // _where([1,2,3])

  // _where({a: null})
  // _where({a: 1})
  // _where({a: 'a'})
  // _where({a: [1,2,3]})
  // _where({a: [1,2,3], b: 1})

  // _where('id', null)
  // _where('id', 1)
  // _where('id', 'a')
  // _where('id', [1,2,3])

  // _where('id', 'a', null)
  // _where('id', 'a', 1)
  // _where('id', 'a', 'a')
  // _where('id', 'a', [1,2,3])

  // const table = 'user'

  if (options.length == 1) {
    const key = 'id'
    const val = options[0]

    if (val === null) {
      return { str: `${_quote(table)}.${_quote(key)} IS NULL`, vals: [] }
    }
    if (T.num(val)) {
      return { str: `${_quote(table)}.${_quote(key)} = ?`, vals: [val] }
    }
    if (T.str(val)) {
      return { str: `${_quote(table)}.${_quote(key)} = ?`, vals: [val] }
    }
    if (T.arr(val)) {
      if (val.length > 0) {
        return { str: `${_quote(table)}.${_quote(key)} IN (${Array(val.length).fill('?').join(',')})`, vals: val }
      } else {
        return { str: `1 = 0`, vals: [] }
      }
    }
    if (T.obj(val)) {
      const strs = []
      const vals = []
      for (const k in val) {
        const v = val[k]

        if (v === null) {
          strs.push(`${_quote(table)}.${_quote(k)} IS NULL`)
        }
        if (T.num(v)) {
          strs.push(`${_quote(table)}.${_quote(k)} = ?`)
          vals.push(v)
        }
        if (T.arr(v)) {
          if (v.length > 0) {
            strs.push(`${_quote(table)}.${_quote(k)} IN (${Array(v.length).fill('?').join(',')})`)
            vals.push(...v)
          } else {
            strs.push(`1 = 0`)
          }
        }
        if (T.str(v)) {
          strs.push(`${_quote(table)}.${_quote(k)} = ?`)
          vals.push(v)
        }
      }

      if (strs.length > 0) {
        return { str: strs.join(' AND '), vals }
      }
    }
  }
  if (options.length == 2) {
    const key = options[0]
    const val = options[1]

    if (val === null) {
      return { str: `${_quote(table)}.${_quote(key)} IS NULL`, vals: [] }
    }
    if (T.num(val)) {
      return { str: `${_quote(table)}.${_quote(key)} = ?`, vals: [val] }
    }
    if (T.str(val)) {
      return { str: `${_quote(table)}.${_quote(key)} = ?`, vals: [val] }
    }
    if (T.arr(val)) {
      if (val.length > 0) {
        return { str: `${_quote(table)}.${_quote(key)} IN (${Array(val.length).fill('?').join(',')})`, vals: val }
      } else {
        return { str: `1 = 0`, vals: [] }
      }
    }
  }

  const key = options[0]
  const cmp = options[1].trim()
  const val = options[2]

  if (val === null) {
    if (['!=', '!==', 'IS NOT'].includes(cmp.toUpperCase())) {
      return { str: `${_quote(table)}.${_quote(key)} IS NOT NULL`, vals: [] }
    } else {
      return { str: `${_quote(table)}.${_quote(key)} IS NULL`, vals: [] }
    }
  }
  if (T.num(val)) {
    return { str: `${_quote(table)}.${_quote(key)} ${cmp} ?`, vals: [val] }
  }
  if (T.str(val)) {
    return { str: `${_quote(table)}.${_quote(key)} ${cmp} ?`, vals: [val] }
  }
  if (T.arr(val)) {
    if (['!=', '!==', 'NOT IN'].includes(cmp.toUpperCase())) {
      if (val.length > 0) {
        return { str: `${_quote(table)}.${_quote(key)} NOT IN (${Array(val.length).fill('?').join(',')})`, vals: val }
      } else {
        return { str: `1 = 1`, vals: [] }
      }
    } else {
      if (val.length > 0) {
        return { str: `${_quote(table)}.${_quote(key)} IN (${Array(val.length).fill('?').join(',')})`, vals: val }
      } else {
        return { str: `1 = 0`, vals: [] }
      }
    }
  }
  return null
}

const _find = (builder, closure, isOne) => {
  if (T.num(closure)) {
    _where(builder.name, closure)
    closure = null
  }

  if (T.bool(closure)) {
    isOne = closure
    closure = null
  }

  return closureOrPromise(closure, async _ => {
    const Table = require('./Table.js')
    const table = await Table.instance(builder.proto)
    const data = await table.find(builder)

    if (isOne) {
      return data.shift() || null
    }
    return data
  })
}

const Builder = function (proto, type = 'select') {
  if (!(this instanceof Builder)) {
    return new Builder(proto, type)
  }

  this.type = type
  this.proto = proto
  this.option = {}
  this._vals = []
}

Builder.quote = _quote

Object.defineProperty(Builder.prototype, 'name', {
  get() {
    return this.proto.table === undefined
      ? this.proto.name
      : this.proto.table
  }
})
Object.defineProperty(Builder.prototype, 'vals', {
  get() {
    return this._vals
  }
})

Builder.prototype.andWhere = function (...options) {
  const where = _where(this.name, ...options)
  if (where === null) {
    return this
  }

  if (T.obj(this.option.where)) {
    this.option.where.str = `(${this.option.where.str}) AND (${where.str})`
    this.option.where.vals = [...this.option.where.vals, ...where.vals]
  } else {
    this.option.where = where
  }

  return this
}

Builder.prototype.orWhere = function (...options) {
  const where = _where(this.name, ...options)
  if (where === null) {
    return this
  }

  if (T.obj(this.option.where)) {
    this.option.where.str = `(${this.option.where.str}) OR (${where.str})`
    this.option.where.vals = [...this.option.where.vals, ...where.vals]
  } else {
    this.option.where = where
  }

  return this
}

Builder.prototype.where = function (...options) {
  return this.andWhere(...options)
}

Builder.prototype.select = function (...options) {
  let option = options.shift()

  if (option === undefined) {
    return this
  }

  if (T.str(option)) {
    option = option.search(/,/g) == -1
      ? [option]
      : option.split(',').map(t => t.trim())

    const tmps = options.length
      ? [...option, ...options]
      : option

    option = tmps.filter(t => t.length)
  }

  if (typeof option != 'object') {
    return this
  }

  if (!T.arr(option)) {
    option = [option]
  }

  const as = obj => {
    let tmps = []
    for (let key in obj) {
      tmps.push(`${key} AS ${obj[key]}`)
    }
    return tmps
  }

  const select = []

  for (let key in option) {
    if (T.str(option[key])) {
      select.push(`${option[key]}`)
    }

    if (T.obj(option[key])) {
      select.push(...as(option[key]))
    }
  }

  if (select.length) {
    this.option.select = select.join(',')
  }

  return this
}

Builder.prototype.order = function (...options) {
  let option = options.shift()

  if (option === undefined) {
    return this
  }

  if (T.str(option)) {
    option = option.search(/,/g) == -1
      ? [option]
      : option.split(',').map(t => t.trim())

    const tmps = options.length
      ? [...option, ...options]
      : option

    option = tmps.filter(t => t.length)
  }

  if (typeof option != 'object') {
    return this
  }

  if (!T.arr(option)) {
    option = [option]
  }

  const join = obj => {
    let tmps = []
    for (let key in obj) {
      tmps.push(`${_quote(this.name)}.${_quote(key)} ${obj[key]}`)
    }
    return tmps
  }

  const order = []

  for (let key in option) {
    if (T.str(option[key])) {
      const [t1 = null, t2 = 'asc'] = option[key].split(' ').map(t => t.trim()).filter(t => t.length)

      if (t1 !== null) {
        order.push(`${_quote(this.name)}.${_quote(t1)} ${t2}`)
      }
    }

    if (T.obj(option[key])) {
      order.push(...join(option[key]))
    }
  }

  if (order.length) {
    this.option.order = order.join(',')
  }

  return this
}

Builder.prototype.limit = function (option) {
  this.option.limit = option
  return this
}

Builder.prototype.offset = function (option) {
  this.option.offset = option
  return this
}

Builder.prototype.group = function (option) {
  this.option.group = option
  return this
}

Builder.prototype.having = function (option) {
  this.option.having = option
  return this
}

Builder.prototype.join = function (name, primary, foreign, type = 'INNER') {
  this.option.join = `${type} JOIN ${_quote(name)} ON ${_quote(name)}.${_quote(primary)}=${_quote(this.name)}.${_quote(foreign)}`
  return this
}

Builder.prototype.update = function (_attrs, closure = null) {
  return closureOrPromise(closure, async _ => {
    this.type = 'update'

    const Table = require('./Table.js')
    const table = await Table.instance(this.proto)
    const attrs = table.attrsToStrings(_attrs)

    if (!Object.keys(attrs).length) {
      return 0
    }

    const { affectedRows } = await DB.sql(this.attrs(attrs))
    return affectedRows
  })
}

Builder.prototype.delete = function (closure = null) {
  return closureOrPromise(closure, async _ => {
    this.type = 'delete'

    const { affectedRows } = await DB.sql(this)
    return affectedRows
  })
}

Builder.prototype.findAll = function (closure = null) { return _find(this, closure, false) }
Builder.prototype.findOne = function (closure = null) { return _find(this, closure, true) }

Builder.prototype.count = function (closure = null) {
  return closureOrPromise(closure, async _ => {
    const { count = 0 } = await this.select({ 'count(*)': 'count' }).group(undefined).findOne()
    return count
  })
}

Builder.prototype.truncate = function (closure = null) { return DB.sql(`TRUNCATE TABLE ${_quote(this.name)};`, closure) }
Builder.prototype.one = function (closure = null) { return this.findOne(closure) }
Builder.prototype.all = function (closure = null) { return this.findAll(closure) }

Builder.prototype.attrs = function (attrs) {
  this.option.attrs = attrs
  return this
}

Builder.prototype._insertString = function () {
  const keys = []
  const vals = []
  const questions = []

  for (let key in this.option.attrs) {
    keys.push(`${_quote(key)}`)
    questions.push(`?`)
    vals.push(this.option.attrs[key])
  }

  const strs = ['INSERT']
  strs.push('INTO')
  strs.push(_quote(this.name))
  strs.push(`(${keys.join(',')})`)
  strs.push('VALUES')
  strs.push(`(${questions.join(',')})`)
  this._vals = vals

  return `${strs.join(' ')};`
}

Builder.prototype._updateString = function () {
  const sets = []
  const vals = []

  for (let key in this.option.attrs) {
    sets.push(`${_quote(this.name)}.${_quote(key)}=?`)
    vals.push(this.option.attrs[key])
  }

  const strs = ['UPDATE']
  strs.push(_quote(this.name))
  strs.push('SET')
  strs.push(sets.join(', '))
  this._vals = vals

  if (T.obj(this.option.where)) {
    strs.push('WHERE')
    strs.push(this.option.where.str)
    this._vals.push(...this.option.where.vals)
  }

  return `${strs.join(' ')};`
}

Builder.prototype._deleteString = function () {
  const strs = ['DELETE'];
  strs.push('FROM')
  strs.push(_quote(this.name))

  if (T.obj(this.option.where)) {
    strs.push('WHERE')
    strs.push(this.option.where.str)
    this._vals.push(...this.option.where.vals)
  }

  this.option.order !== undefined && strs.push('ORDER BY ' + this.option.order)

  if (this.option.limit !== undefined && this.option.offset !== undefined) {
    strs.push(`LIMIT ${this.option.offset * 1},${this.option.limit * 1}`)
  } else if (this.option.limit !== undefined) {
    strs.push(`LIMIT ${this.option.limit * 1}`)
  } else if (this.option.offset !== undefined) {
    strs.push(`OFFSET ${this.option.offset * 1}`)
  }

  return `${strs.join(' ')};`
}

Builder.prototype._selectString = function () {
  const strs = ['SELECT']

  strs.push(this.option.select === undefined ? `${_quote(this.name)}.*` : this.option.select)
  strs.push('FROM')
  strs.push(_quote(this.name))

  this.option.joinIn !== undefined && strs.push(this.option.join)

  if (T.obj(this.option.where)) {
    strs.push('WHERE')
    strs.push(this.option.where.str)
    this._vals.push(...this.option.where.vals)
  }
  this.option.group !== undefined && strs.push('GROUP BY ' + this.option.group)
  this.option.having !== undefined && strs.push('HAVING ' + this.option.having)
  this.option.order !== undefined && strs.push('ORDER BY ' + this.option.order)

  if (this.option.limit !== undefined && this.option.offset !== undefined) {
    strs.push(`LIMIT ${this.option.offset * 1},${this.option.limit * 1}`)
  } else if (this.option.limit !== undefined) {
    strs.push(`LIMIT ${this.option.limit * 1}`)
  } else if (this.option.offset !== undefined) {
    strs.push(`OFFSET ${this.option.offset * 1}`)
  }

  return `${strs.join(' ')};`
}

Builder.prototype.toString = function () {
  if (this.type == 'select') {
    return this._selectString()
  }
  if (this.type == 'update') {
    return this._updateString()
  }
  if (this.type == 'insert') {
    return this._insertString()
  }
  if (this.type == 'delete') {
    return this._deleteString()
  }

  return ';'
}

module.exports = Builder
