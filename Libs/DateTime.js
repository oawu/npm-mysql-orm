/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { Str: { pad } } = require('@oawu/helper')

const DateTime = function (type, value = new Date()) {
  if (!(this instanceof DateTime)) {
    return new DateTime(type, value)
  }

  this.date = null
  this.type = type != 'time' ? type != 'date' ? 'datetime' : 'date' : 'time'
  this.setValue(value)
}

Object.defineProperty(DateTime.prototype, 'format', {
  get() {
    if (this.type == 'time') {
      return 'H:i:s'
    }
    if (this.type == 'date') {
      return 'Y-m-d'
    }
    return 'Y-m-d H:i:s'
  }
})

Object.defineProperty(DateTime.prototype, 'regex', {
  get() {
    if (this.type == 'time') {
      return /^(?<H>[0-1][0-9]|2[0-3]):(?<i>[0-5][0-9]):(?<s>[0-5][0-9])$/g
    }
    if (this.type == 'date') {
      return /^(?<Y>[\d]{4})-(?<m>0[1-9]|1[0-2])-(?<d>0[1-9]|[1-2][0-9]|3[0-1])$/g
    }
    return /^(?<Y>[\d]{4})-(?<m>0[1-9]|1[0-2])-(?<d>0[1-9]|[1-2][0-9]|3[0-1]) (?<H>[0-1][0-9]|2[0-3]):(?<i>[0-5][0-9]):(?<s>[0-5][0-9])$/g
  }
})

Object.defineProperty(DateTime.prototype, 'value', {
  get() {
    return this.date instanceof Date
      ? this.format
        .replace('Y', this.date.getFullYear())
        .replace('m', pad(this.date.getMonth() + 1))
        .replace('d', pad(this.date.getDate()))
        .replace('H', pad(this.date.getHours()))
        .replace('i', pad(this.date.getMinutes()))
        .replace('s', pad(this.date.getSeconds()))
      : null
  }
})

DateTime.prototype.toString = function () {
  return this.value || ''
}

DateTime.prototype.setValue = function (val) {
  if (val === null) {
    this.date = null
    return this
  }

  if (val instanceof DateTime) {
    this.date = val.date
    return this
  }

  if (val instanceof Date) {
    this.date = val
    return this
  }

  if (this.type == 'datetime') {
    this.date = new Date(
      this.regex.exec(val).groups.Y,
      this.regex.exec(val).groups.m - 1,
      this.regex.exec(val).groups.d,
      this.regex.exec(val).groups.H,
      this.regex.exec(val).groups.i,
      this.regex.exec(val).groups.s)
    return this
  }

  if (this.type == 'date') {
    this.date = new Date(
      this.regex.exec(val).groups.Y,
      this.regex.exec(val).groups.m - 1,
      this.regex.exec(val).groups.d,
      0, 0, 0)
    return this
  }

  if (this.type == 'time') {
    this.date = new Date(0, 0, 0,
      this.regex.exec(val).groups.H,
      this.regex.exec(val).groups.i,
      this.regex.exec(val).groups.s)
    return this
  }

  return this.date = null, this
}

module.exports = DateTime
