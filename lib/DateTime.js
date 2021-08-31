/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const pad0 = t => (t < 10 ? '0' : '') + t

const DateTime = function(type, value = new Date()) {
  if (!(this instanceof DateTime)) return new DateTime(type, value)
  this.date = null
  this.type = type != 'time' ? type != 'date' ? 'datetime' : 'date' : 'time'
  this.setValue(value)
}

Object.defineProperty(DateTime.prototype, 'format', { get () {
  return this.type != 'time' ? this.type != 'date' ? 'Y-m-d H:i:s' : 'Y-m-d' : 'H:i:s'
} })

Object.defineProperty(DateTime.prototype, 'regex', { get () {
  return this.type != 'time'
    ? this.type != 'date'
      ? /^(?<Y>[\d]{4})-(?<m>0[1-9]|1[1-2])-(?<d>0[1-9]|[1-2][0-9]|3[0-1]) (?<H>[0-1][0-9]|2[0-3]):(?<i>[0-5][0-9]):(?<s>[0-5][0-9])$/g
      : /^(?<Y>[\d]{4})-(?<m>0[1-9]|1[1-2])-(?<d>0[1-9]|[1-2][0-9]|3[0-1])$/g
    : /^(?<H>[0-1][0-9]|2[0-3]):(?<i>[0-5][0-9]):(?<s>[0-5][0-9])$/g
} })

Object.defineProperty(DateTime.prototype, 'value', { get () {
  return this.date instanceof Date
    ? this.format
      .replace('Y', this.date.getFullYear())
      .replace('m', pad0(this.date.getMonth() + 1))
      .replace('d', pad0(this.date.getDate()))
      .replace('H', pad0(this.date.getHours()))
      .replace('i', pad0(this.date.getMinutes()))
      .replace('s', pad0(this.date.getSeconds()))
    : null
  }
})

DateTime.prototype.toString = function() { return this.value || '' }

DateTime.prototype.setValue = function(val) {
  if (val === null)
    return this.date = null, this

  if (val instanceof DateTime)
    return this.date = val.date, this

  if (val instanceof Date)
    return this.date = val, this

  if (this.type == 'datetime')
    return this.date = new Date(this.regex.exec(val).groups.Y, this.regex.exec(val).groups.m - 1, this.regex.exec(val).groups.d, this.regex.exec(val).groups.H, this.regex.exec(val).groups.i, this.regex.exec(val).groups.s), this

  if (this.type == 'date')
    return this.date = new Date(this.regex.exec(val).groups.Y, this.regex.exec(val).groups.m - 1, this.regex.exec(val).groups.d, 0, 0, 0), this

  if (this.type == 'time')
    return this.date = new Date(0, 0, 0, this.regex.exec(val).groups.H, this.regex.exec(val).groups.i, this.regex.exec(val).groups.s), this

  return this.date = null, this
}

module.exports = DateTime
