/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { Model } = require('./index.js')
const { Type: T } = require('@oawu/helper')

const data1 = { name: 'oaoa', sex: 'male', height: 171.1, bio: 'test' }
const data2 = { name: 'oboa', sex: 'female', height: 171.3, bio: 'test' }
const data3 = { name: 'oaoc', sex: 'male', height: 171.2, bio: '' }
const data4 = { name: `oa${'\\'}${'"'}od`, sex: 'male', height: 171.1, bio: '' }

const cmpUser = (user, data) => {
  if (user.name !== data.name) {
    throw new Error('Error! name')
  }
  if (user.sex !== data.sex) {
    throw new Error('Error! sex')
  }
  if (user.height !== data.height) {
    throw new Error('Error! height')
  }
  if (user.bio !== data.bio) {
    throw new Error('Error! bio')
  }
}

const cmpCount = (val, count) => {
  if (val !== count) {
    throw new Error('Error! count')
  }
}
const cmpUsers = (users, dataList) => {
  cmpCount(users.length, dataList.length)
  for (let i = 0; i < users.length; i++) {
    cmpUser(users[i], dataList[i])
  }
}
const truncate = async Model => {
  process.stdout.write(`  truncate closure\n`)
  await new Promise((resolve, reject) => Model.truncate(error => T.error(error) ? reject(error) : resolve(error)))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  truncate promise\n`)
  await new Promise((resolve, reject) => Model.truncate().then(resolve).catch(reject))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  truncate async\n`)
  await Model.truncate()
  process.stdout.write(`  ➜ ok\n`)
}
const create = async Model => {
  let user = null
  process.stdout.write(`  create closure\n`)
  user = await new Promise((resolve, reject) => Model.create(data1, error => T.error(error) ? reject(error) : resolve(error)))
  cmpUser(user, data1)
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  create promise\n`)
  user = await new Promise((resolve, reject) => Model.create(data2).then(resolve).catch(reject))
  cmpUser(user, data2)
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  create async\n`)
  user = await Model.create(data3)
  cmpUser(user, data3)
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  create closure\n`)
  user = await new Promise((resolve, reject) => Model.create(data4, error => T.error(error) ? reject(error) : resolve(error)))
  cmpUser(user, data4)
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  create promise\n`)
  user = await new Promise((resolve, reject) => Model.create(data4).then(resolve).catch(reject))
  cmpUser(user, data4)
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  create async\n`)
  user = await Model.create(data4)
  cmpUser(user, data4)
  process.stdout.write(`  ➜ ok\n`)
}
const count = async Model => {
  process.stdout.write('  count\n')

  let count = null
  process.stdout.write(`  count closure\n`)
  count = await new Promise((resolve, reject) => Model.count(error => T.error(error) ? reject(error) : resolve(error)))
  cmpCount(count, 6)
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  count promise\n`)
  count = await new Promise((resolve, reject) => Model.count().then(resolve).catch(reject))
  cmpCount(count, 6)
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  count async\n`)
  count = await Model.count()
  cmpCount(count, 6)
  process.stdout.write(`  ➜ ok\n`)
}
const whereBase = async Model => {
  const id_2_1 = async _ => {
    let users = null

    process.stdout.write('  where(2) closure\n')
    users = await new Promise((resolve, reject) => Model.where(2).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(2) promise\n')
    users = await new Promise((resolve, reject) => Model.where(2).all().then(resolve).catch(reject))
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(2) async\n')
    users = await Model.where(2).all()
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_2_2 = async _ => {
    let users = null

    process.stdout.write('  where(id, 2) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', 2).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, 2) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', 2).all().then(resolve).catch(reject))
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, 2) async\n')
    users = await Model.where('id', 2).all()
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_2_3 = async _ => {
    let users = null

    process.stdout.write('  where(id, =, 2) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', '=', 2).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, =, 2) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', '=', 2).all().then(resolve).catch(reject))
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, =, 2) async\n')
    users = await Model.where('id', '=', 2).all()
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_2_4 = async _ => {
    let users = null

    process.stdout.write('  where(id, >, 2) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', '>', 2).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, >, 2) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', '>', 2).all().then(resolve).catch(reject))
    cmpUsers(users, [data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, >, 2) async\n')
    users = await Model.where('id', '>', 2).all()
    cmpUsers(users, [data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_2_5 = async _ => {
    let users = null

    process.stdout.write('  where(id, >=, 2) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', '>=', 2).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, >=, 2) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', '>=', 2).all().then(resolve).catch(reject))
    cmpUsers(users, [data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, >=, 2) async\n')
    users = await Model.where('id', '>=', 2).all()
    cmpUsers(users, [data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_2_6 = async _ => {
    let users = null

    process.stdout.write('  where(id, <, 2) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', '<', 2).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, <, 2) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', '<', 2).all().then(resolve).catch(reject))
    cmpUsers(users, [data1])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, <, 2) async\n')
    users = await Model.where('id', '<', 2).all()
    cmpUsers(users, [data1])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_2_7 = async _ => {
    let users = null

    process.stdout.write('  where(id, <=, 2) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', '<=', 2).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1, data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, <=, 2) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', '<=', 2).all().then(resolve).catch(reject))
    cmpUsers(users, [data1, data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, <=, 2) async\n')
    users = await Model.where('id', '<=', 2).all()
    cmpUsers(users, [data1, data2])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_2_8 = async _ => {
    let users = null

    process.stdout.write('  where(id, !=, 2) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', '!=', 2).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, !=, 2) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', '!=', 2).all().then(resolve).catch(reject))
    cmpUsers(users, [data1, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, !=, 2) async\n')
    users = await Model.where('id', '!=', 2).all()
    cmpUsers(users, [data1, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_2_9 = async _ => {
    let users = null

    process.stdout.write('  where({ id: 2 }) closure\n')
    users = await new Promise((resolve, reject) => Model.where({ id: 2 }).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where({ id: 2 }) promise\n')
    users = await new Promise((resolve, reject) => Model.where({ id: 2 }).all().then(resolve).catch(reject))
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where({ id: 2 }) async\n')
    users = await Model.where({ id: 2 }).all()
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)
  }
  //========
  const id_0_1 = async _ => {
    let users = null

    process.stdout.write('  where(0) closure\n')
    users = await new Promise((resolve, reject) => Model.where(0).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(0) promise\n')
    users = await new Promise((resolve, reject) => Model.where(0).all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(0) async\n')
    users = await Model.where(0).all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_0_2 = async _ => {
    let users = null

    process.stdout.write('  where(id, 0) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', 0).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, 0) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', 0).all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, 0) async\n')
    users = await Model.where('id', 0).all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_0_3 = async _ => {
    let users = null

    process.stdout.write('  where(id, =, 0) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', '=', 0).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, =, 0) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', '=', 0).all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, =, 0) async\n')
    users = await Model.where('id', '=', 0).all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_0_4 = async _ => {
    let users = null

    process.stdout.write('  where(id, >, 7) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', '>', 7).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, >, 7) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', '>', 7).all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, >, 7) async\n')
    users = await Model.where('id', '>', 7).all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_0_5 = async _ => {
    let users = null

    process.stdout.write('  where(id, >=, 7) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', '>=', 7).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, >=, 7) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', '>=', 7).all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, >=, 7) async\n')
    users = await Model.where('id', '>=', 7).all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_0_6 = async _ => {
    let users = null

    process.stdout.write('  where(id, <, 0) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', '<', 0).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, <, 0) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', '<', 0).all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, <, 0) async\n')
    users = await Model.where('id', '<', 0).all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_0_7 = async _ => {
    let users = null

    process.stdout.write('  where(id, <=, 0) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', '<=', 0).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, <=, 0) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', '<=', 0).all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, <=, 0) async\n')
    users = await Model.where('id', '<=', 0).all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_0_8 = async _ => {
    let users = null

    process.stdout.write('  where(id, !=, 0) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', '!=', 0).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1, data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, !=, 0) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', '!=', 0).all().then(resolve).catch(reject))
    cmpUsers(users, [data1, data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, !=, 0) async\n')
    users = await Model.where('id', '!=', 0).all()
    cmpUsers(users, [data1, data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_0_9 = async _ => {
    let users = null

    process.stdout.write('  where({ id: 0 }) closure\n')
    users = await new Promise((resolve, reject) => Model.where({ id: 0 }).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where({ id: 0 }) promise\n')
    users = await new Promise((resolve, reject) => Model.where({ id: 0 }).all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where({ id: 0 }) async\n')
    users = await Model.where({ id: 0 }).all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }
  //========
  const name_like_1 = async _ => {
    let users = null
    process.stdout.write('  where(name, like, %b%) closure\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'like', '%b%').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, like, %b%) promise\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'like', '%b%').all().then(resolve).catch(reject))
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, like, %b%) async\n')
    users = await Model.where('name', 'like', '%b%').all()
    cmpUsers(users, [data2])
    process.stdout.write(`  ➜ ok\n`)
  }
  const name_like_2 = async _ => {
    let users = null
    process.stdout.write('  where(name, like, %oa) closure\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'like', '%oa').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1, data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, like, %oa) promise\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'like', '%oa').all().then(resolve).catch(reject))
    cmpUsers(users, [data1, data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, like, %oa) async\n')
    users = await Model.where('name', 'like', '%oa').all()
    cmpUsers(users, [data1, data2])
    process.stdout.write(`  ➜ ok\n`)
  }
  const name_like_3 = async _ => {
    let users = null
    process.stdout.write('  where(name, like, %oao) closure\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'like', '%oao').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, like, %oao) promise\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'like', '%oao').all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, like, %oao) async\n')
    users = await Model.where('name', 'like', '%oao').all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }
  const name_like_4 = async _ => {
    let users = null
    process.stdout.write('  where(name, like, %d%) closure\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'like', '%d%').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, like, %d%) promise\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'like', '%d%').all().then(resolve).catch(reject))
    cmpUsers(users, [data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, like, %d%) async\n')
    users = await Model.where('name', 'like', '%d%').all()
    cmpUsers(users, [data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  //========
  const name_not_like_1 = async _ => {
    let users = null
    process.stdout.write('  where(name, not like, %b%) closure\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'not like', '%b%').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, not like, %b%) promise\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'not like', '%b%').all().then(resolve).catch(reject))
    cmpUsers(users, [data1, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, not like, %b%) async\n')
    users = await Model.where('name', 'not like', '%b%').all()
    cmpUsers(users, [data1, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  const name_not_like_2 = async _ => {
    let users = null
    process.stdout.write('  where(name, not like, %oa) closure\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'not like', '%oa').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, not like, %oa) promise\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'not like', '%oa').all().then(resolve).catch(reject))
    cmpUsers(users, [data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, not like, %oa) async\n')
    users = await Model.where('name', 'not like', '%oa').all()
    cmpUsers(users, [data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  const name_not_like_3 = async _ => {
    let users = null
    process.stdout.write('  where(name, not like, %oao) closure\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'not like', '%oao').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1, data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, not like, %oao) promise\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'not like', '%oao').all().then(resolve).catch(reject))
    cmpUsers(users, [data1, data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, not like, %oao) async\n')
    users = await Model.where('name', 'not like', '%oao').all()
    cmpUsers(users, [data1, data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  const name_not_like_4 = async _ => {
    let users = null
    process.stdout.write('  where(name, not like, %d%) closure\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'not like', '%d%').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1, data2, data3])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, not like, %d%) promise\n')
    users = await new Promise((resolve, reject) => Model.where('name', 'not like', '%d%').all().then(resolve).catch(reject))
    cmpUsers(users, [data1, data2, data3])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(name, not like, %d%) async\n')
    users = await Model.where('name', 'not like', '%d%').all()
    cmpUsers(users, [data1, data2, data3])
    process.stdout.write(`  ➜ ok\n`)
  }
  //========
  const id_arr_24_1 = async _ => {
    let users = null
    process.stdout.write('  where([2, 4]) closure\n')
    users = await new Promise((resolve, reject) => Model.where([2, 4]).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data2, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where([2, 4]) promise\n')
    users = await new Promise((resolve, reject) => Model.where([2, 4]).all().then(resolve).catch(reject))
    cmpUsers(users, [data2, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where([2, 4]) async\n')
    users = await Model.where([2, 4]).all()
    cmpUsers(users, [data2, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_arr_24_2 = async _ => {
    let users = null
    process.stdout.write('  where(id, [2, 4]) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', [2, 4]).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data2, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, [2, 4]) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', [2, 4]).all().then(resolve).catch(reject))
    cmpUsers(users, [data2, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, [2, 4]) async\n')
    users = await Model.where('id', [2, 4]).all()
    cmpUsers(users, [data2, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_arr_24_3 = async _ => {
    let users = null
    process.stdout.write('  where(id, IN, [2, 4]) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', 'IN', [2, 4]).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data2, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, IN, [2, 4]) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', 'IN', [2, 4]).all().then(resolve).catch(reject))
    cmpUsers(users, [data2, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, IN, [2, 4]) async\n')
    users = await Model.where('id', 'IN', [2, 4]).all()
    cmpUsers(users, [data2, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_arr_24_4 = async _ => {
    let users = null
    process.stdout.write('  where(id, NOT IN, [2, 4]) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', 'NOT IN', [2, 4]).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1, data3, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, NOT IN, [2, 4]) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', 'NOT IN', [2, 4]).all().then(resolve).catch(reject))
    cmpUsers(users, [data1, data3, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, NOT IN, [2, 4]) async\n')
    users = await Model.where('id', 'NOT IN', [2, 4]).all()
    cmpUsers(users, [data1, data3, data4, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_arr_24_5 = async _ => {
    let users = null
    process.stdout.write('  where({ id: [2, 4] }) closure\n')
    users = await new Promise((resolve, reject) => Model.where({ id: [2, 4] }).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data2, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where({ id: [2, 4] }) promise\n')
    users = await new Promise((resolve, reject) => Model.where({ id: [2, 4] }).all().then(resolve).catch(reject))
    cmpUsers(users, [data2, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where({ id: [2, 4] }) async\n')
    users = await Model.where({ id: [2, 4] }).all()
    cmpUsers(users, [data2, data4])
    process.stdout.write(`  ➜ ok\n`)
  }

  const id_arr_0_1 = async _ => {
    let users = null
    process.stdout.write('  where([]) closure\n')
    users = await new Promise((resolve, reject) => Model.where([]).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where([]) promise\n')
    users = await new Promise((resolve, reject) => Model.where([]).all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where([]) async\n')
    users = await Model.where([]).all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_arr_0_2 = async _ => {
    let users = null
    process.stdout.write('  where(id, []) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', []).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, []) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', []).all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, []) async\n')
    users = await Model.where('id', []).all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_arr_0_3 = async _ => {
    let users = null
    process.stdout.write('  where(id, IN, []) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', 'IN', []).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, IN, []) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', 'IN', []).all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, IN, []) async\n')
    users = await Model.where('id', 'IN', []).all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_arr_0_4 = async _ => {
    let users = null
    process.stdout.write('  where(id, NOT IN, []) closure\n')
    users = await new Promise((resolve, reject) => Model.where('id', 'NOT IN', []).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1, data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, NOT IN, []) promise\n')
    users = await new Promise((resolve, reject) => Model.where('id', 'NOT IN', []).all().then(resolve).catch(reject))
    cmpUsers(users, [data1, data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(id, NOT IN, []) async\n')
    users = await Model.where('id', 'NOT IN', []).all()
    cmpUsers(users, [data1, data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)
  }
  const id_arr_0_5 = async _ => {
    let users = null
    process.stdout.write('  where({ id: [] }) closure\n')
    users = await new Promise((resolve, reject) => Model.where({ id: [] }).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where({ id: [] }) promise\n')
    users = await new Promise((resolve, reject) => Model.where({ id: [] }).all().then(resolve).catch(reject))
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where({ id: [] }) async\n')
    users = await Model.where({ id: [] }).all()
    cmpUsers(users, [])
    process.stdout.write(`  ➜ ok\n`)
  }

  await id_2_1() // where(2)
  await id_2_2() // where('id', 2)
  await id_2_3() // where('id', '=', 2)
  await id_2_4() // where('id', '>', 2)
  await id_2_5() // where('id', '>=', 2)
  await id_2_6() // where('id', '<', 2)
  await id_2_7() // where('id', '<=', 2)
  await id_2_8() // where('id', '!=', 2)
  await id_2_9() // where({ id: 2 })

  await id_0_1() // where(0)
  await id_0_2() // where('id', 0)
  await id_0_3() // where('id', '=', 0)
  await id_0_4() // where('id', '>', 7)
  await id_0_5() // where('id', '>=', 7)
  await id_0_6() // where('id', '<', 0)
  await id_0_7() // where('id', '<=', 0)
  await id_0_8() // where('id', '!=', 0)
  await id_0_9() // where({ id: 0 })

  await name_like_1() // where('name', 'like', '%b%')
  await name_like_2() // where('name', 'like', '%oa')
  await name_like_3() // where('name', 'like', '%oao')
  await name_like_4() // where('name', 'like', '%d%')

  await name_not_like_1() // where('name', 'not like', '%b%')
  await name_not_like_2() // where('name', 'not like', '%oa')
  await name_not_like_3() // where('name', 'not like', '%oao')
  await name_not_like_4() // where('name', 'not like', '%d%')

  await id_arr_24_1() // where([2,4])
  await id_arr_24_2() // where('id', [2,4])
  await id_arr_24_3() // where('id', 'IN', [2,4])
  await id_arr_24_4() // where('id', 'NOT IN', [2,4])
  await id_arr_24_5() // where({ id: [2,4] })

  await id_arr_0_1() // where([])
  await id_arr_0_2() // where('id', [])
  await id_arr_0_3() // where('id', 'IN', [])
  await id_arr_0_4() // where('id', 'NOT IN', [])
  await id_arr_0_5() // where({ id: [] })
}
const whereAnd = async Model => {
  const f1 = async _ => {
    let users = null

    process.stdout.write('  where({sex: male, bio: test}) closure\n')
    users = await new Promise((resolve, reject) => Model.where({sex: 'male', bio: 'test'}).all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where({sex: male, bio: test}) promise\n')
    users = await new Promise((resolve, reject) => Model.where({sex: 'male', bio: 'test'}).all().then(resolve).catch(reject))
    cmpUsers(users, [data1])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where({sex: male, bio: test}) async\n')
    users = await Model.where({sex: 'male', bio: 'test'}).all()
    cmpUsers(users, [data1])
    process.stdout.write(`  ➜ ok\n`)
  }
  const f2 = async _ => {
    let users = null

    process.stdout.write('  where(sex, male).where(bio, test) closure\n')
    users = await new Promise((resolve, reject) => Model.where('sex', 'male').where('bio', 'test').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(sex, male).where(bio, test) promise\n')
    users = await new Promise((resolve, reject) => Model.where('sex', 'male').where('bio', 'test').all().then(resolve).catch(reject))
    cmpUsers(users, [data1])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(sex, male).where(bio, test) async\n')
    users = await Model.where('sex', 'male').where('bio', 'test').all()
    cmpUsers(users, [data1])
    process.stdout.write(`  ➜ ok\n`)
  }
  const f3 = async _ => {
    let users = null

    process.stdout.write('  where(sex, male).andWhere(bio, test) closure\n')
    users = await new Promise((resolve, reject) => Model.where('sex', 'male').andWhere('bio', 'test').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(sex, male).andWhere(bio, test) promise\n')
    users = await new Promise((resolve, reject) => Model.where('sex', 'male').andWhere('bio', 'test').all().then(resolve).catch(reject))
    cmpUsers(users, [data1])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(sex, male).andWhere(bio, test) async\n')
    users = await Model.where('sex', 'male').andWhere('bio', 'test').all()
    cmpUsers(users, [data1])
    process.stdout.write(`  ➜ ok\n`)
  }
  const f4 = async _ => {
    let users = null

    process.stdout.write('  where(sex, male).andWhere(bio, !=, test) closure\n')
    users = await new Promise((resolve, reject) => Model.where('sex', 'male').andWhere('bio', '!=', 'test').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(sex, male).andWhere(bio, !=, test) promise\n')
    users = await new Promise((resolve, reject) => Model.where('sex', 'male').andWhere('bio', '!=', 'test').all().then(resolve).catch(reject))
    cmpUsers(users, [data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(sex, male).andWhere(bio, !=, test) async\n')
    users = await Model.where('sex', 'male').andWhere('bio', '!=', 'test').all()
    cmpUsers(users, [data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)
  }

  await f1() // {sex: male, bio: test}
  await f2() // sex=male and bio = test
  await f3() // sex=male and bio = test
  await f4() // sex=male and bio != test
}
const whereOr = async Model => {
  const f1 = async _ => {
    let users = null

    process.stdout.write('  where(sex, female).orWhere(bio, test) closure\n')
    users = await new Promise((resolve, reject) => Model.where('sex', 'female').orWhere('bio', 'test').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data1, data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(sex, female).orWhere(bio, test) promise\n')
    users = await new Promise((resolve, reject) => Model.where('sex', 'female').orWhere('bio', 'test').all().then(resolve).catch(reject))
    cmpUsers(users, [data1, data2])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(sex, female).orWhere(bio, test) async\n')
    users = await Model.where('sex', 'female').orWhere('bio', 'test').all()
    cmpUsers(users, [data1, data2])
    process.stdout.write(`  ➜ ok\n`)
  }
  const f2 = async _ => {
    let users = null

    process.stdout.write('  where(sex, female).orWhere(bio, !=, test) closure\n')
    users = await new Promise((resolve, reject) => Model.where('sex', 'female').orWhere('bio', '!=', 'test').all(error => T.error(error) ? reject(error) : resolve(error)))
    cmpUsers(users, [data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(sex, female).orWhere(bio, !=, test) promise\n')
    users = await new Promise((resolve, reject) => Model.where('sex', 'female').orWhere('bio', '!=', 'test').all().then(resolve).catch(reject))
    cmpUsers(users, [data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)

    process.stdout.write('  where(sex, female).orWhere(bio, !=, test) async\n')
    users = await Model.where('sex', 'female').orWhere('bio', '!=', 'test').all()
    cmpUsers(users, [data2, data3, data4, data4, data4])
    process.stdout.write(`  ➜ ok\n`)
  }

  await f1() // sex=female or bio = test
  await f2() // sex=female or bio != test
}
const whereAndOr = async Model => {
  // sex=male and bio != test or height = 171.3
  let users = null

  process.stdout.write('  where(sex, male).andWhere(bio, !=, test).orWhere(height, 171.3) closure\n')
  users = await new Promise((resolve, reject) => Model.where('sex', 'female').orWhere('bio', '!=', 'test').all(error => T.error(error) ? reject(error) : resolve(error)))
  cmpUsers(users, [data2, data3, data4, data4, data4])
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  where(sex, male).andWhere(bio, !=, test).orWhere(height, 171.3) promise\n')
  users = await new Promise((resolve, reject) => Model.where('sex', 'female').orWhere('bio', '!=', 'test').all().then(resolve).catch(reject))
  cmpUsers(users, [data2, data3, data4, data4, data4])
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  where(sex, male).andWhere(bio, !=, test).orWhere(height, 171.3) async\n')
  users = await Model.where('sex', 'female').orWhere('bio', '!=', 'test').all()
  cmpUsers(users, [data2, data3, data4, data4, data4])
  process.stdout.write(`  ➜ ok\n`)
}
const one = async Model => {
  let user = null

  process.stdout.write('  one closure\n')
  user = await new Promise((resolve, reject) => Model.where(3).one(error => T.error(error) ? reject(error) : resolve(error)))
  cmpUser(user, data3)
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  one promise\n')
  user = await new Promise((resolve, reject) => Model.where(3).one().then(resolve).catch(reject))
  cmpUser(user, data3)
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  one async\n')
  user = await Model.where(3).one()
  cmpUser(user, data3)
  process.stdout.write(`  ➜ ok\n`)
}
const select = async Model => {
  let user = null

  process.stdout.write('  select closure\n')
  user = await new Promise((resolve, reject) => Model.where(3).select('id').one(error => T.error(error) ? reject(error) : resolve(error)))
  if (user.name !== undefined) {
    throw new Error('欄位錯誤！')
  }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  select promise\n')
  user = await new Promise((resolve, reject) => Model.where(3).select('id').one().then(resolve).catch(reject))
  if (user.name !== undefined) {
    throw new Error('欄位錯誤！')
  }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  select async\n')
  user = await Model.where(3).select('id').one()
  if (user.name !== undefined) {
    throw new Error('欄位錯誤！')
  }
  process.stdout.write(`  ➜ ok\n`)
}
const limit = async Model => {
  let users = null

  process.stdout.write('  where(id, >, 1).where(id, <, 6).limit(3) closure\n')
  users = await new Promise((resolve, reject) => Model.where('id', '>', 1).where('id', '<', 6).limit(3).all(error => T.error(error) ? reject(error) : resolve(error)))
  cmpUsers(users, [data2, data3, data4])
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  where(id, >, 1).where(id, <, 6).limit(3) promise\n')
  users = await new Promise((resolve, reject) => Model.where('id', '>', 1).where('id', '<', 6).limit(3).all().then(resolve).catch(reject))
  cmpUsers(users, [data2, data3, data4])
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  where(id, >, 1).where(id, <, 6).limit(3) async\n')
  users = await Model.where('id', '>', 1).where('id', '<', 6).limit(3).all()
  cmpUsers(users, [data2, data3, data4])
  process.stdout.write(`  ➜ ok\n`)
}
const order = async Model => {
  let users = null

  process.stdout.write('  where(id, >, 1).where(id, <, 6).order(id desc) closure\n')
  users = await new Promise((resolve, reject) => Model.where('id', '>', 1).where('id', '<', 6).order('id desc').all(error => T.error(error) ? reject(error) : resolve(error)))
  cmpUsers(users, [data4, data4, data3, data2])
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  where(id, >, 1).where(id, <, 6).order(id desc) promise\n')
  users = await new Promise((resolve, reject) => Model.where('id', '>', 1).where('id', '<', 6).order('id desc').all().then(resolve).catch(reject))
  cmpUsers(users, [data4, data4, data3, data2])
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  where(id, >, 1).where(id, <, 6).order(id desc) async\n')
  users = await Model.where('id', '>', 1).where('id', '<', 6).order('id desc').all()
  cmpUsers(users, [data4, data4, data3, data2])
  process.stdout.write(`  ➜ ok\n`)
}
const offset = async Model => {
  let users = null

  process.stdout.write('  where(id, >, 1).where(id, <, 6).offset(1) closure\n')
  users = await new Promise((resolve, reject) => Model.where('id', '>', 1).where('id', '<', 6).offset(1).limit(3).all(error => T.error(error) ? reject(error) : resolve(error)))
  cmpUsers(users, [data3, data4, data4])
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  where(id, >, 1).where(id, <, 6).offset(1) promise\n')
  users = await new Promise((resolve, reject) => Model.where('id', '>', 1).where('id', '<', 6).offset(1).limit(3).all().then(resolve).catch(reject))
  cmpUsers(users, [data3, data4, data4])
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  where(id, >, 1).where(id, <, 6).offset(1) async\n')
  users = await Model.where('id', '>', 1).where('id', '<', 6).offset(1).limit(3).all()
  cmpUsers(users, [data3, data4, data4])
  process.stdout.write(`  ➜ ok\n`)
}
const update = async Model => {
  let count = null
  let users = null

  process.stdout.write('  update() closure\n')
  count = await new Promise((resolve, reject) => Model.update({ name: 'a' }, error => T.error(error) ? reject(error) : resolve(error)))
  if (count !== 6) { throw new Error('更新筆數錯誤') }
  users = await Model.all()
  for (const user of users) { if (user.name !== 'a') { throw new Error('更新錯誤') } }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  update() promise\n')
  count = await new Promise((resolve, reject) => Model.update({ name: 'b' }).then(resolve).catch(reject))
  if (count !== 6) { throw new Error('更新筆數錯誤') }
  users = await Model.all()
  for (const user of users) { if (user.name !== 'b') { throw new Error('更新錯誤') } }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  update() async\n')
  count = await Model.update({ name: 'c' })
  if (count !== 6) { throw new Error('更新筆數錯誤') }
  users = await Model.all()
  for (const user of users) { if (user.name !== 'c') { throw new Error('更新錯誤') } }
  process.stdout.write(`  ➜ ok\n`)
}
const updateWhere = async Model => {
  let count = null
  let users = null

  await Model.update({ name: 'x' })

  process.stdout.write('  where(id > 1).update() closure\n')
  count = await new Promise((resolve, reject) => Model.where('id', '>', 1).update({ name: 'a' }, error => T.error(error) ? reject(error) : resolve(error)))
  if (count !== 5) { throw new Error('更新筆數錯誤') }
  users = await Model.where('id', '<=', 1).all()
  for (const user of users) { if (user.name !== 'x') { throw new Error('更新錯誤') } }
  users = await Model.where('id', '>', 1).all()
  for (const user of users) { if (user.name !== 'a') { throw new Error('更新錯誤') } }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  where(id > 1).update() promise\n')
  count = await new Promise((resolve, reject) => Model.where('id', '>', 1).update({ name: 'b' }).then(resolve).catch(reject))
  if (count !== 5) { throw new Error('更新筆數錯誤') }
  users = await Model.where('id', '<=', 1).all()
  for (const user of users) { if (user.name !== 'x') { throw new Error('更新錯誤') } }
  users = await Model.where('id', '>', 1).all()
  for (const user of users) { if (user.name !== 'b') { throw new Error('更新錯誤') } }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  where(id > 1).update() async\n')
  count = await Model.where('id', '>', 1).update({ name: 'c' })
  if (count !== 5) { throw new Error('更新筆數錯誤') }
  users = await Model.where('id', '<=', 1).all()
  for (const user of users) { if (user.name !== 'x') { throw new Error('更新錯誤') } }
  users = await Model.where('id', '>', 1).all()
  for (const user of users) { if (user.name !== 'c') { throw new Error('更新錯誤') } }
  process.stdout.write(`  ➜ ok\n`)
}
const updateObject = async Model => {
  let count = null
  let users = null

  await Model.update({ name: 'x' })

  process.stdout.write('  obj.update() closure\n')
  await new Promise(async (resolve, reject) => {
    const user = await Model.where(3).one()
    user.name = 'a'
    user.save(error => T.error(error) ? reject(error) : resolve(error))
  })

  users = await Model.where('id', '!=', 3).all()
  for (const user of users) { if (user.name !== 'x') { throw new Error('更新錯誤') } }
  users = await Model.where(3).all()
  for (const user of users) { if (user.name !== 'a') { throw new Error('更新錯誤') } }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  obj.update() promise\n')
  await new Promise(async (resolve, reject) => {
    const user = await Model.where(3).one()
    user.name = 'b'
    user.save().then(resolve).catch(reject)
  })
  users = await Model.where('id', '!=', 3).all()
  for (const user of users) { if (user.name !== 'x') { throw new Error('更新錯誤') } }
  users = await Model.where(3).all()
  for (const user of users) { if (user.name !== 'b') { throw new Error('更新錯誤') } }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write('  obj.update() promise\n')
  const user = await Model.where(3).one()
  user.name = 'c'
  await user.save()
  users = await Model.where('id', '!=', 3).all()
  for (const user of users) { if (user.name !== 'x') { throw new Error('更新錯誤') } }
  users = await Model.where(3).all()
  for (const user of users) { if (user.name !== 'c') { throw new Error('更新錯誤') } }
  process.stdout.write(`  ➜ ok\n`)
}
const del = async Model => {
  let count = null
  let users = null

  await Model.truncate()
  await Model.create(data1)
  await Model.create(data2)
  await Model.create(data3)
  await Model.create(data4)
  await Model.create(data4)
  await Model.create(data4)

  process.stdout.write('  delete() closure\n')
  count = await new Promise((resolve, reject) => Model.delete(error => T.error(error) ? reject(error) : resolve(error)))
  if (count !== 6) { throw new Error('更新筆數錯誤') }
  users = await Model.all()
  cmpUsers(users, [])
  process.stdout.write(`  ➜ ok\n`)

  await Model.truncate()
  await Model.create(data1)
  await Model.create(data2)
  await Model.create(data3)
  await Model.create(data4)
  await Model.create(data4)
  await Model.create(data4)

  process.stdout.write('  delete() promise\n')
  count = await new Promise((resolve, reject) => Model.delete().then(resolve).catch(reject))
  if (count !== 6) { throw new Error('更新筆數錯誤') }
  users = await Model.all()
  cmpUsers(users, [])
  process.stdout.write(`  ➜ ok\n`)

  await Model.truncate()
  await Model.create(data1)
  await Model.create(data2)
  await Model.create(data3)
  await Model.create(data4)
  await Model.create(data4)
  await Model.create(data4)

  process.stdout.write('  delete() async\n')
  count = await Model.delete()
  if (count !== 6) { throw new Error('更新筆數錯誤') }
  users = await Model.all()
  cmpUsers(users, [])
  process.stdout.write(`  ➜ ok\n`)
}
const delWhere = async Model => {
  let count = null
  let users = null

  await Model.truncate()
  await Model.create(data1)
  await Model.create(data2)
  await Model.create(data3)
  await Model.create(data4)
  await Model.create(data4)
  await Model.create(data4)

  process.stdout.write('  where(id > 1).delete() closure\n')
  count = await new Promise((resolve, reject) => Model.where('id', '>', 1).delete(error => T.error(error) ? reject(error) : resolve(error)))
  if (count !== 5) { throw new Error('更新筆數錯誤') }
  users = await Model.all()
  cmpUsers(users, [data1])
  process.stdout.write(`  ➜ ok\n`)

  await Model.truncate()
  await Model.create(data1)
  await Model.create(data2)
  await Model.create(data3)
  await Model.create(data4)
  await Model.create(data4)
  await Model.create(data4)

  process.stdout.write('  where(id > 1).delete() promise\n')
  count = await new Promise((resolve, reject) => Model.where('id', '>', 1).delete().then(resolve).catch(reject))
  if (count !== 5) { throw new Error('更新筆數錯誤') }
  users = await Model.all()
  cmpUsers(users, [data1])
  process.stdout.write(`  ➜ ok\n`)

  await Model.truncate()
  await Model.create(data1)
  await Model.create(data2)
  await Model.create(data3)
  await Model.create(data4)
  await Model.create(data4)
  await Model.create(data4)

  process.stdout.write('  where(id > 1).delete() async\n')
  count = await Model.where('id', '>', 1).delete()
  if (count !== 5) { throw new Error('更新筆數錯誤') }
  users = await Model.all()
  cmpUsers(users, [data1])
  process.stdout.write(`  ➜ ok\n`)
}
const delObject = async Model => {
  let users = null

  await Model.truncate()
  await Model.create(data1)
  await Model.create(data2)
  await Model.create(data3)
  await Model.create(data4)
  await Model.create(data4)
  await Model.create(data4)

  process.stdout.write('  obj.delete() closure\n')
  await new Promise(async (resolve, reject) => {
    const user = await Model.where(3).one()
    user.delete(error => T.error(error) ? reject(error) : resolve(error))
  })
  users = await Model.all()
  cmpUsers(users, [data1, data2, data4, data4, data4])
  process.stdout.write(`  ➜ ok\n`)

  await Model.truncate()
  await Model.create(data1)
  await Model.create(data2)
  await Model.create(data3)
  await Model.create(data4)
  await Model.create(data4)
  await Model.create(data4)

  process.stdout.write('  obj.delete() promise\n')
  await new Promise(async (resolve, reject) => {
    const user = await Model.where(3).one()
    user.delete().then(resolve).catch(reject)
  })
  users = await Model.all()
  cmpUsers(users, [data1, data2, data4, data4, data4])
  process.stdout.write(`  ➜ ok\n`)

  await Model.truncate()
  await Model.create(data1)
  await Model.create(data2)
  await Model.create(data3)
  await Model.create(data4)
  await Model.create(data4)
  await Model.create(data4)

  process.stdout.write('  obj.delete() promise\n')
  const user = await Model.where(3).one()
  await user.delete()
  users = await Model.all()
  users = await Model.all()
  cmpUsers(users, [data1, data2, data4, data4, data4])
  process.stdout.write(`  ➜ ok\n`)
}

const case1 = async Model => {
  process.stdout.write(`測試 Model - 1\n`)

  await truncate(Model)
  await create(Model)
  await count(Model)

  await whereBase(Model)
  await whereAnd(Model)
  await whereOr(Model)
  await whereAndOr(Model)

  await one(Model)
  await select(Model)
  await limit(Model)
  await order(Model)
  await offset(Model)

  await update(Model)
  await updateWhere(Model)
  await updateObject(Model)

  await del(Model)
  await delWhere(Model)
  await delObject(Model)
}

module.exports = async _ => {
  await case1(Model.User)
  await case1(Model.Device)
}
