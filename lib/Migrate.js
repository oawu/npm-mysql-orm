/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2022, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { insert } = require('./Func.js')

const MigrateCreateAttr = function(name) {
  if (!(this instanceof MigrateCreateAttr)) return new MigrateCreateAttr(name)
  this.tokens = ['`' + name + '`']
}

MigrateCreateAttr.prototype = {...MigrateCreateAttr.prototype, 
  toString () { return this.tokens.join(' ') },
  val: val => val !== null ? val != 'CURRENT_TIMESTAMP' ? "'" + val + "'" : 'CURRENT_TIMESTAMP' : 'NULL',
    
  int (length) { return this.tokens.push('int(' + (!isNaN(length) ? length : 10) + ')'), this },
  varchar (length) { return this.tokens.push('varchar(' + (!isNaN(length) ? length : 190) + ')'), this },
  enum (...items) { return this.tokens.push('enum(' + items.map(item => "'" + item + "'").join(',') + ')'), this },
  text () { return this.tokens.push('text'), this },
  decimal (maximum, digits) { return this.tokens.push('decimal(' + maximum + ',' + digits + ')'), this },
  datetime () { return this.tokens.push('datetime'), this },
  collate (code) { return this.tokens.push('COLLATE ' + code), this },
  notNull () { return this.tokens.push('NOT NULL'), this },
  comment (text) { return this.tokens.push('COMMENT ' + "'" + text + "'"), this },
  autoIncrement () { return this.tokens.push('AUTO_INCREMENT'), this },
  unsigned () { return this.tokens.push('unsigned'), this },
  default (val) { return this.tokens.push('DEFAULT ' + this.val(val)), this },
  on (action, val) { return this.tokens.push('ON ' + action.toUpperCase() + ' ' + this.val(val)), this },
}

const MigrateCreate = function(table, comment) {
  if (!(this instanceof MigrateCreate)) return new MigrateCreate(table, comment)
  this.table = table
  this.comment = comment
  this.attrs = []
  this.columns = {}
}

MigrateCreate.prototype = {...MigrateCreate.prototype,
  toString () { return 'CREATE TABLE `' + this.table + '` (' + this.attrs.join(',') + ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' + (this.comment ? " COMMENT='" + this.comment + "'" : '') + ";" },

  primaryKey (column) { return typeof this.columns[column] == 'undefined' || this.attrs.push('PRIMARY KEY (`' + column + '`)'), this },

  attr (name) {
    const attr = MigrateCreateAttr(name)
    this.attrs.push(attr)
    this.columns[name] = attr
    return attr
  }
}

const MigrateDrop = function(table) {
  if (!(this instanceof MigrateDrop)) return new MigrateDrop(table)
  this.table = table
}

MigrateDrop.prototype.toString = function() { return 'DROP TABLE IF EXISTS `' + this.table + '`;' }

const MigrateTruncate = function(table) {
  if (!(this instanceof MigrateTruncate)) return new MigrateTruncate(table)
  this.table = table
}

MigrateTruncate.prototype.toString = function() { return 'TRUNCATE TABLE `' + this.table + '`;' }

const MigrateInserts = function(table, datas, length) {
  if (!(this instanceof MigrateInserts)) return new MigrateInserts(table, datas, length)
  this.table = table
  this.datas = datas
  this.length = length || 100
}

MigrateInserts.prototype.toString = function() {
  const datas = this.datas.map(insert)
  if (!datas.length) return ''
  
  const keys = datas[0].keys
  let valuess = datas.map(data => '(' + data.values.join(',') + ')')
  
  const sqls = []  

  for (let i = 0; i < valuess.length; i += this.length)
    sqls.push("INSERT INTO `" + this.table + "`(" + keys.join(',') + ")VALUES" + valuess.splice(0, this.length).join(','))

  return sqls.join(';')
}

module.exports = {
  create: (table, comment) => MigrateCreate(table, comment),
  drop: table => MigrateDrop(table),
  inserts: (table, datas) => MigrateInserts(table, datas),
  truncate: table => MigrateTruncate(table),
}
