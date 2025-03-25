/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { closureOrPromise, Json, Type: T } = require('@oawu/helper')

const DateTime = require('./DateTime.js')

const CREATE_AT = 'createAt'
const UPDATE_AT = 'updateAt'

const _modify = {
  int: val => val !== null ? parseInt(val, 10) : val,
  float: val => val !== null ? parseFloat(val) : val,
  string: val => val !== null ? `${val}` : null,
  json: val => val !== null
    ? T.str(val)
      ? Json.toObject(val)
      : val
    : null,

  enum: (format, val) => {
    if (val === null) {
      return null
    }
    if (!format.vals.includes(`${val}`)) {
      throw new Error(`「${format.field}」欄位格式為「${format.type}」，選項有「${format.vals.join('、')}」，您給予的值為：${val}，不在選項內`)
    }
    return `${val}`
  },
  nullable: (format, val) => {
    if (!format.nullable && !format.auto && (val === undefined || val === null)) {
      throw new Error(`「${format.field}」不可以為 NULL`)
    }
  },
  init(format, val) {
    this.nullable(format, val)

    if (['tinyint', 'smallint', 'mediumint', 'int', 'bigint'].includes(format.type)) {
      return this.int(val)
    }
    if (['float', 'double', 'numeric', 'decimal', 'dec'].includes(format.type)) {
      return this.float(val)
    }
    if (['datetime', 'timestamp', 'date', 'time'].includes(format.type)) {
      return DateTime(format.type, val)
    }
    if (['json'].includes(format.type)) {
      return this.json(val)
    }
    if (['enum'].includes(format.type)) {
      return this.enum(format, val)
    }
    return this.string(val)
  },
  update(format, oldVal, newVal) {
    this.nullable(format, newVal)

    if (oldVal instanceof DateTime) {
      return oldVal.setValue(newVal)
    }

    if (['tinyint', 'smallint', 'mediumint', 'int', 'bigint'].includes(format.type)) {
      return this.int(newVal)
    }
    if (['float', 'double', 'numeric', 'decimal', 'dec'].includes(format.type)) {
      return this.float(newVal)
    }
    if (['datetime', 'timestamp', 'date', 'time'].includes(format.type)) {
      return DateTime(format.type, newVal)
    }
    if (['json'].includes(format.type)) {
      return this.json(newVal)
    }
    if (['enum'].includes(format.type)) {
      return this.enum(format, newVal)
    }

    return this.string(newVal)
  }
}

const _attrDefaults = (table, attrs, full = true) => {
  const columns = table.columns

  if (columns[CREATE_AT] !== undefined && attrs[CREATE_AT] === undefined) {
    attrs[CREATE_AT] = DateTime(columns[CREATE_AT].type)
  }

  if (columns[UPDATE_AT] !== undefined && attrs[UPDATE_AT] === undefined)
    attrs[UPDATE_AT] = DateTime(columns[UPDATE_AT].type)

  const newAttrs = {}

  for (let key in columns) {
    if (!(full || attrs[$key] !== undefined)) {
      continue
    }

    if (attrs[key] === undefined) {
      attrs[key] = columns[key].default
    }

    if (!columns[key].nullable && !columns[key].auto && (attrs[key] === undefined || attrs[key] === null)) {
      throw new Error(`「${key}」不可以為 NULL`)
    }

    newAttrs[key] = attrs[key] !== undefined
      ? columns[key].type == 'json'
        ? Json.toString(attrs[key])
        : attrs[key]
      : newAttrs[key] == null
  }

  return newAttrs
}

const Model = function (table, row, isNew = false) {
  const object = new table.model(row)

  const $ = {
    table,
    isNew,
    attrs: new Map(),
    dirties: [],

    get primaries() {
      const primaries = {}
      for (let key of table.primaries) {
        if (this.attrs.has(key)) {
          primaries[key] = this.attrs.get(key)
        }
      }
      return primaries
    }
  }

  Object.defineProperty(object, '$', { get() { return $ } })

  if (isNew) {
    row = _attrDefaults(table, row)
  }

  for (let name in row) {
    const val = table.columns[name] !== undefined
      ? _modify.init(table.columns[name], row[name])
      : row[name]

    $.attrs.set(name, val)

    Object.defineProperty(object, name, {
      enumerable: true,
      get() { return $.attrs.get(name) },
      set(val) {
        return $.dirties.push(name),
          $.attrs.set(name, _modify.update(table.columns[name],
            $.attrs.get(name), val))
      }
    })
  }

  return object
}

Model.prototype.save = function (closure) {
  return this.$.isNew
    ? this.insert(closure)
    : this.update(closure)
}

Model.prototype.insert = function (closure) {
  const attrs = {}

  for (let key in this.$.table.columns) {
    attrs[key] = this[key]
  }

  return this.$.table.insert(this, attrs, closure)
}

Model.prototype.update = function (closure) {
  if (!Object.keys(this.$.primaries).length) {
    return closureOrPromise(closure, new Error(`更新資料失敗，錯誤原因：找不到 Primary Key`))
  }

  if (!this.$.dirties.length) {
    return closureOrPromise(closure, this)
  }

  // update_at
  if (this.$.table.columns[UPDATE_AT] !== undefined && this[UPDATE_AT] !== undefined && !this.$.dirties.includes(UPDATE_AT)) {
    this[UPDATE_AT] = DateTime(this.$.table.columns[UPDATE_AT].type)
  }

  const attrs = {}
  for (let dirty of this.$.dirties) {
    attrs[dirty] = this[dirty]
  }

  return this.$.table.update(this, attrs, this.$.primaries, closure)
}

Model.prototype.delete = function (closure) {
  if (Object.keys(this.$.primaries).length) {
    return this.$.table.delete(this, this.$.primaries, closure)
  }

  return closureOrPromise(closure, new Error(`更新資料失敗，錯誤原因：找不到 Primary Key`))
}

module.exports = Model
