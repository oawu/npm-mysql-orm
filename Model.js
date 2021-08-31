/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Extend = model => {
  const Model = require('./lib/Model.js')
  const Builder = require('./lib/Builder.js')

  for (let key in Model.prototype)
    model.prototype[key] = Model.prototype[key]

  Object.defineProperty(model.prototype, 'dump', { get () {
    const tmp = {}
    for (let key of this.$.attrs.keys())
      tmp[key] = this.$.attrs.get(key)
    return tmp
  } })

  model.one   = (closure = null) => Builder(model).find(closure, true)
  model.all   = (closure = null) => Builder(model).find(closure, false)
  model.count = (closure = null) => Builder(model).count(closure)
  model.truncate = (closure = null) => Builder(model).truncate(closure)

  model.create = (attr = {}, allowKeys = [], closure = null) => {
    if (typeof attr == 'function')
      closure = attr, attr = {}, allowKeys = []

    if (typeof allowKeys == 'function')
      closure = allowKeys, allowKeys = []

    const newAttr = {}
    for(let key in attr)
      if (!allowKeys.lenght || allowKeys.includes(key))
        newAttr[key] = attr[key]

    const Table = require('./lib/Table.js')

    return closure
      ? Table.instance(model, (error, table) => error
        ? closure(error, null)
        : Model(table, newAttr, true).save(closure))
      : new Promise((resolve, reject) => Table.instance(model, (error, table) => error
        ? reject(error)
        : Model(table, newAttr, true).save((error, model) => error
          ? reject(error)
          : resolve(model))))
  }

  model.update = option => Builder(model).update(option)
  model.limit  = option => Builder(model).limit(option)
  model.offset = option => Builder(model).offset(option)
  model.group  = option => Builder(model).group(option)
  model.having = option => Builder(model).having(option)
  model.where  = (...options) => Builder(model).where(...options)
  model.order  = (...options) => Builder(model).order(...options)
  model.select = (...options) => Builder(model).select(...options)
  model.join   = (model, primary, foreign, type = 'INNER') => Builder(model).join(model, primary, foreign)

  return model
}

const initeds = new Map()

const Model = (model = null) => {
  if (model === null)
    return Model

  if (typeof model == 'string')
    return Model[model]

  if (initeds.has(model))
    return Model[model.name] = model = initeds.get(model),
      model
  
  return Model[model.name] = model = Extend(model),
    initeds.set(model, model),
    model
}

module.exports = Model
