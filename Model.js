/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { closureOrPromise } = require('@oawu/helper')

const Builder = require('./lib/Builder.js')
const Table   = require('./lib/Table.js')
const _Model   = require('./lib/Model.js')

const _extend = model => {
  for (let key in _Model.prototype) {
    model.prototype[key] = _Model.prototype[key]
  }

  Object.defineProperty(model.prototype, 'dump', { get () {
    const tmp = {}
    for (let key of this.$.attrs.keys()) {
      tmp[key] = this.$.attrs.get(key)
    }
    return tmp
  } })

  model.one      = (...params) => Builder(model).findOne(...params)
  model.all      = (...params) => Builder(model).findAll(...params)
  model.count    = (...params) => Builder(model).count(...params)
  model.truncate = (...params) => Builder(model).truncate(...params)
  model.update   = (...params) => Builder(model).update(...params)
  model.delete   = (...params) => Builder(model).delete(...params)
  model.limit    = (...params) => Builder(model).limit(...params)
  model.offset   = (...params) => Builder(model).offset(...params)
  model.group    = (...params) => Builder(model).group(...params)
  model.having   = (...params) => Builder(model).having(...params)
  model.where    = (...params) => Builder(model).where(...params)
  model.order    = (...params) => Builder(model).order(...params)
  model.select   = (...params) => Builder(model).select(...params)
  model.join     = (model, primary, foreign, type = 'INNER') => Builder(model).join(model, primary, foreign)

  model.create = (attr = {}, allowKeys = [], closure = null) => {
    if (typeof attr == 'function') {
      closure = attr
      attr = {}
      allowKeys = []
    }

    if (typeof allowKeys == 'function') {
      closure = allowKeys
      allowKeys = []
    }

    const newAttr = {}
    for(let key in attr) {
      if (!allowKeys.lenght || allowKeys.includes(key)) {
        newAttr[key] = attr[key]
      }
    }

    return closureOrPromise(closure, async _ => {
      const table = await Table.instance(model)
      return await _Model(table, newAttr, true).save()
    })
  }

  return model
}

const _instances = new Map()

const Model = (model = null) => {
  if (model === null) {
    return Model
  }

  if (typeof model == 'string') {
    return Model[model]
  }

  if (_instances.has(model)) {
    model = _instances.get(model)
    Model[model.name] = model
    return model
  }

  model = _extend(model)
  Model[model.name] = model
  _instances.set(model, model)
  return model
}

module.exports = Model