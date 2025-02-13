/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { Type: T } = require('@oawu/helper')

const _insert = obj => {
  let keys = [], values = []

  for (let i in obj) {
    keys.push('`' + i + '`')
    values.push(obj[i] !== null ? "'" + obj[i] + "'" : 'NULL')
  }

  return { keys, values }
}
const _update = obj => {
  let sets = []

  for (let i in obj) {
    sets.push('`' + i + '`=' + (obj[i] !== null ? "'" + obj[i] + "'" : 'NULL'))
  }

  return sets
}

const MigrateCreateAttr = function(name) {
  if (!(this instanceof MigrateCreateAttr)) {
    return new MigrateCreateAttr(name)
  }
  this.tokens = ['`' + name + '`']
}

const _val = val => val !== null
  ? val != 'CURRENT_TIMESTAMP'
    ? `'${val}'`
    : 'CURRENT_TIMESTAMP'
  : 'NULL'

MigrateCreateAttr.prototype = {...MigrateCreateAttr.prototype,
  toString () { return this.tokens.join(' ') },

  tinyint (length = 3) {
    this.tokens.push(`tinyint(${T.num(length) ? 3 : length})`)
    return this
  },
  smallint (length = 5) {
    this.tokens.push(`smallint(${T.num(length) ? 5 : length})`)
    return this
  },
  mediumint (length = 8) {
    this.tokens.push(`mediumint(${T.num(length) ? 8 : length})`)
    return this
  },
  int (length = 10) {
    this.tokens.push(`int(${T.num(length) ? 10 : length})`)
    return this
  },
  bigint (length = 20) {
    this.tokens.push(`bigint(${T.num(length) ? 20 : length})`)
    return this
  },
  varchar (length = 190) {
    this.tokens.push(`varchar(${T.num(length) ? 190 : length})`)
    return this
  },
  enum (...items) {
    this.tokens.push(`enum(${items.map(item => `'${item}'`).join(',')})`)
    return this
  },
  text () {
    this.tokens.push('text')
    return this
  },
  decimal (maximum, digits) {
    if (T.num(maximum) && T.num(digits)) {
      this.tokens.push(`decimal(${maximum},${digits})`)
    }
    return this
  },
  datetime () {
    this.tokens.push('datetime')
    return this
  },
  collate (code) {
    this.tokens.push(`COLLATE ${code}`)
    return this
  },
  notNull () {
    this.tokens.push('NOT NULL')
    return this
  },
  comment (text) {
    this.tokens.push(`COMMENT '${text}'`)
    return this
  },
  autoIncrement () {
    this.tokens.push('AUTO_INCREMENT')
    return this
  },
  unsigned () {
    this.tokens.push('unsigned')
    return this
  },
  default (val) {
    this.tokens.push(`DEFAULT ${_val(val)}`)
    return this
  },
  on (action, val) {
    this.tokens.push(`ON ${action.toUpperCase()} ${_val(val)}`)
    return this
  },
}

/**
 *         Name || Bytes ||                  Min | Max                 || Min | Max
 *--------------------------------------------------------------------------------------------
 *   tinyint(3) ||    1  ||                 -128 | 127                 ||   0 | 255
 *  smallint(5) ||    2  ||               -32768 | 32767               ||   0 | 65535
 * mediumint(8) ||    3  ||             -8388608 | 8388607             ||   0 | 16777215
 *      int(10) ||    4  ||          -2147483648 | 2147483647          ||   0 | 4294967295
 *   bigint(20) ||    8  || -9223372036854775808 | 9223372036854775807 ||   0 | 18446744073709551615
**/

const MigrateCreate = function(table, comment) {
  if (!(this instanceof MigrateCreate)) {
    return new MigrateCreate(table, comment)
  }
  this.table = table
  this.comment = comment
  this.attrs = []
  this.columns = {}
}

MigrateCreate.prototype = {...MigrateCreate.prototype,
  toString () {
    return 'CREATE TABLE `' + this.table + '` (' + this.attrs.join(',') + ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' + (this.comment ? " COMMENT='" + this.comment + "'" : '') + ";"
  },

  index (columns, name = null) {
    if (!T.arr(columns) || columns.length <= 0) {
      return this
    }
    this.attrs.push(`INDEX ${T.str(name) ? name : `${columns.join('_')}_index`} (${columns.map(column => '`' + column + '`').join(', ')})`)
  },
  unique (columns, name = null) {
    if (!T.arr(columns) || columns.length <= 0) {
      return this
    }
    this.attrs.push(`UNIQUE ${T.str(name) ? name : `${columns.join('_')}_unique`} (${columns.map(column => '`' + column + '`').join(', ')})`)
  },
  primaryKey (column) {
    if (typeof this.columns[column] != 'undefined') {
      this.attrs.push('PRIMARY KEY (`' + column + '`)')
    }
    return this
  },

  attr (name) {
    const attr = MigrateCreateAttr(name)
    this.attrs.push(attr)
    this.columns[name] = attr
    return attr
  }
}

const MigrateDrop = function(table) {
  if (!(this instanceof MigrateDrop)) {
    return new MigrateDrop(table)
  }
  this.table = table
}

MigrateDrop.prototype.toString = function() {
  return 'DROP TABLE IF EXISTS `' + this.table + '`;'
}

const MigrateTruncate = function(table) {
  if (!(this instanceof MigrateTruncate)) {
    return new MigrateTruncate(table)
  }
  this.table = table
}

MigrateTruncate.prototype.toString = function() {
  return 'TRUNCATE TABLE `' + this.table + '`;'
}

const MigrateInserts = function(table, datas, length = 100) {
  if (!(this instanceof MigrateInserts)) {
    return new MigrateInserts(table, datas, length)
  }
  this.table = table
  this.datas = datas
  this.length = T.num(length) ? length : 100
}

MigrateInserts.prototype.toString = function() {
  const datas = this.datas.map(_insert)

  if (!datas.length) {
    return ''
  }

  const keys = datas[0].keys
  let valuess = datas.map(data => `(${data.values.join(',')})`)

  const sqls = []

  for (let i = 0; i < valuess.length; i += this.length) {
    sqls.push("INSERT INTO `" + this.table + "`(" + keys.join(',') + ")VALUES" + valuess.splice(0, this.length).join(','))
  }

  return sqls.join(';')
}

module.exports = {
  create: (table, comment) => MigrateCreate(table, comment),
  drop: table => MigrateDrop(table),
  inserts: (table, datas, length = 100) => MigrateInserts(table, datas, length),
  truncate: table => MigrateTruncate(table),
}
