/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const DateTime = require('./DateTime.js')

const parseJson = text => {
  try { return JSON.parse(text) }
  catch (e) { return null }
}

const stringJson = object => {
  try { return JSON.stringify(object) }
  catch (e) { return null }
}

const columnFormat = infos => {
  const row = {}
  for (let key in infos)
    row[key.toLowerCase()] = infos[key]
  
  const matches1 = /^(?<type>[A-Za-z0-9_]+)(\((?<length>.*)\))?( (?<infos>.*))?/g.exec(row.type)
  
  let type   = matches1.groups && matches1.groups.type   ? matches1.groups.type : row.type
  const length = matches1.groups && matches1.groups.length ? matches1.groups.length : null
  infos  = matches1.groups && matches1.groups.infos  ? matches1.groups.infos.split(' ').map(info => info.trim()).filter(info => info !== '') : []

  if (type == 'timestamp')
    type = 'datetime'

  if (type == 'integer')
    type = 'int'

  const val = {
    type,
    infos,
    field:    row.field,
    nullable: row.null  === 'YES',
    primary:  row.key   === 'PRI',
    auto:     row.extra === 'auto_increment',
    default:  row.default,
  }

  if (type == 'enum')
    val.vals = length.split(',').map(t => t.trim().replace(/^'(.*)'$/g, '$1').replace(/'{2}/g, '\''))
  
  if (type == 'varchar' || type == 'int')
    val.length = parseInt(length, 10)

  if (type == 'decimal')
    val.length = length.split(',').map(t => t.trim()).filter(t => t !== '').map(t => parseInt(t, 10))

  return val
}

const nullable = (format, val) => {
  if (!format.nullable && !format.auto && (val === undefined || val === null))
    throw new Error(`「${format.field}」不可以為 NULL`)
}

const modify = {
  int   : val => val !== null ? parseInt(val, 10) : val ,
  float : val => val !== null ? parseFloat(val) : val ,
  json  : val => val !== null ? typeof val == 'string' ? parseJson(val) : val : null ,
  string: val => val !== null ? `${val}` : null ,
  enum  : (format, val) => {
    if (val === null) return null
    if (!format.vals.includes(`${val}`)) throw new Error(`「${format.field}」欄位格式為「${format.type}」，選項有「${format.vals.join('、')}」，您給予的值為：${val}，不在選項內`)
    return `${val}`
  },
  init (format, val) {
    nullable(format, val)
    if (['tinyint', 'smallint', 'mediumint', 'int', 'bigint'].includes(format.type)) return this.int(val)
    if (['float', 'double', 'numeric', 'decimal', 'dec'].includes(format.type)) return this.float(val)
    if (['datetime', 'timestamp', 'date', 'time'].includes(format.type)) return DateTime(format.type, val)
    if (['json'].includes(format.type)) return this.json(val)
    if (['enum'].includes(format.type)) return this.enum(format, val)
    return this.string(val)
  },
  update (format, oldVal, newVal) {
    nullable(format, newVal)

    if (oldVal instanceof DateTime) return oldVal.setValue(newVal)

    if (['tinyint', 'smallint', 'mediumint', 'int', 'bigint'].includes(format.type)) return this.int(newVal)
    if (['float', 'double', 'numeric', 'decimal', 'dec'].includes(format.type)) return this.float(newVal)
    if (['datetime', 'timestamp', 'date', 'time'].includes(format.type)) return DateTime(format.type, newVal)
    if (['json'].includes(format.type)) return this.json(newVal)
    if (['enum'].includes(format.type)) return this.enum(format, newVal)

    return this.string(newVal)
  }
}

const attrsToStrings = (table, attrs) => {
  for (let name in attrs) {

    if (table.columns[name] !== undefined && table.columns[name].type == 'json')
      attrs[name] = stringJson(attrs[name])

    if (attrs[name] instanceof DateTime)
      attrs[name] = attrs[name].value
  }

  return attrs;
}

module.exports = {
  insert: obj => {
    let keys = [], values = []

    for (let i in obj) {
      keys.push('`' + i + '`')
      values.push(obj[i] !== null ? "'" + obj[i] + "'" : 'NULL')
    }

    return { keys, values }
  },
  update: obj => {
    let sets = []

    for (let i in obj)
      sets.push('`' + i + '`=' + (obj[i] !== null ? "'" + obj[i] + "'" : 'NULL'))

    return sets
  },

  quoteName1: name => typeof name == 'string' && !(name[0] === '`' || name[name.length - 1] === '`') ? '`' + name + '`' : name,
  quoteName2: name => typeof name == 'string' ? '"' + name.replace(/"/g, "\\\"") + '"' : name,

  parseJson,
  stringJson,

  modify,
  columnFormat,
  attrsToStrings,
}
