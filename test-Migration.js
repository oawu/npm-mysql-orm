/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const { Migrate } = require('./index.js')
const { Type: T } = require('@oawu/helper')

const executeBase = async _ => {
  process.stdout.write(`  測試 execute(closure)\n`)
  await new Promise((resolve, reject) => Migrate.execute(migrate => T.err(migrate) ? reject(migrate) : resolve(migrate)))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute() promise\n`)
  await new Promise((resolve, reject) => Migrate.execute().then(resolve).catch(reject))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute() async\n`)
  await Migrate.execute()
  process.stdout.write(`  ➜ ok\n`)
}
const executeNum = async val => {
  process.stdout.write(`  測試 execute(${val === null ? 'null' : val}, closure)\n`)
  await new Promise((resolve, reject) => Migrate.execute(val, migrate => T.err(migrate) ? reject(migrate) : resolve(migrate)))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(closure, ${val === null ? 'null' : val})\n`)
  await new Promise((resolve, reject) => Migrate.execute(migrate => T.err(migrate) ? reject(migrate) : resolve(migrate), val))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(${val === null ? 'null' : val}) promise\n`)
  await new Promise((resolve, reject) => Migrate.execute(val).then(resolve).catch(reject))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(${val === null ? 'null' : val}) async\n`)
  await Migrate.execute(val)
  process.stdout.write(`  ➜ ok\n`)
}
const executeShow = async show => {
  process.stdout.write(`  測試 execute(${show ? 'true' : 'false'}, closure)\n`)
  await new Promise((resolve, reject) => Migrate.execute(show, migrate => T.err(migrate) ? reject(migrate) : resolve(migrate)))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(closure, ${show ? 'true' : 'false'})\n`)
  await new Promise((resolve, reject) => Migrate.execute(migrate => T.err(migrate) ? reject(migrate) : resolve(migrate), show))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(${show ? 'true' : 'false'}) promise\n`)
  await new Promise((resolve, reject) => Migrate.execute(show).then(resolve).catch(reject))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(${show ? 'true' : 'false'}) async\n`)
  await Migrate.execute(show)
  process.stdout.write(`  ➜ ok\n`)
}
const executeNumShow = async (val, show) => {
  process.stdout.write(`  測試 execute(${val === null ? 'null' : val}, ${show ? 'true' : 'false'}, closure)\n`)
  await new Promise((resolve, reject) => Migrate.execute(val, show, migrate => T.err(migrate) ? reject(migrate) : resolve(migrate)))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(${val === null ? 'null' : val}, closure, ${show ? 'true' : 'false'})\n`)
  await new Promise((resolve, reject) => Migrate.execute(val, migrate => T.err(migrate) ? reject(migrate) : resolve(migrate), show))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(${show ? 'true' : 'false'}, ${val === null ? 'null' : val}, closure)\n`)
  await new Promise((resolve, reject) => Migrate.execute(show, val, migrate => T.err(migrate) ? reject(migrate) : resolve(migrate)))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(${show ? 'true' : 'false'}, closure, ${val === null ? 'null' : val})\n`)
  await new Promise((resolve, reject) => Migrate.execute(show, migrate => T.err(migrate) ? reject(migrate) : resolve(migrate), val))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(closure, ${show ? 'true' : 'false'}, ${val === null ? 'null' : val})\n`)
  await new Promise((resolve, reject) => Migrate.execute(migrate => T.err(migrate) ? reject(migrate) : resolve(migrate), show, val))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(closure, ${val === null ? 'null' : val}, ${show ? 'true' : 'false'})\n`)
  await new Promise((resolve, reject) => Migrate.execute(migrate => T.err(migrate) ? reject(migrate) : resolve(migrate), val, show))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(${val === null ? 'null' : val}, ${show ? 'true' : 'false'}) promise\n`)
  await new Promise((resolve, reject) => Migrate.execute(val, show).then(resolve).catch(reject))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(${show ? 'true' : 'false'}, ${val === null ? 'null' : val}) promise\n`)
  await new Promise((resolve, reject) => Migrate.execute(show, val).then(resolve).catch(reject))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(${val === null ? 'null' : val}, ${show ? 'true' : 'false'}) async\n`)
  await Migrate.execute(val, show)
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 execute(${show ? 'true' : 'false'}, ${val === null ? 'null' : val}) async\n`)
  await Migrate.execute(show, val)
  process.stdout.write(`  ➜ ok\n`)
}
const refreshBase = async () => {
  process.stdout.write(`  測試 refresh(closure)\n`)
  await new Promise((resolve, reject) => Migrate.refresh(migrate => T.err(migrate) ? reject(migrate) : resolve(migrate)))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 refresh() promise\n`)
  await new Promise((resolve, reject) => Migrate.refresh().then(resolve).catch(reject))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 refresh() async\n`)
  await Migrate.refresh()
  process.stdout.write(`  ➜ ok\n`)
}

const refreshShow = async (show) => {
  process.stdout.write(`  測試 refresh(${show ? 'true' : 'false'}, closure)\n`)
  await new Promise((resolve, reject) => Migrate.refresh(show, migrate => T.err(migrate) ? reject(migrate) : resolve(migrate)))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 refresh(closure, ${show ? 'true' : 'false'})\n`)
  await new Promise((resolve, reject) => Migrate.refresh(migrate => T.err(migrate) ? reject(migrate) : resolve(migrate), show))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 refresh(${show ? 'true' : 'false'}) promise\n`)
  await new Promise((resolve, reject) => Migrate.refresh(show).then(resolve).catch(reject))
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試 refresh(${show ? 'true' : 'false'}) async\n`)
  await Migrate.refresh(show)
  process.stdout.write(`  ➜ ok\n`)
}

module.exports = async _ => {
  process.stdout.write('測試 Migrate\n')

  // execute 基礎測試
  await executeBase()
  // execute 指定版本 0
  await executeNum(0)
  // execute 指定版本 null
  await executeNum(null)
  // 隱藏
  await executeShow(false)
  // 顯示
  await executeShow(true)
  // 混用
  await executeNumShow(0, false)
  await executeNumShow(0, true)
  await executeNumShow(null, false)
  await executeNumShow(null, true)
// =======
  await refreshBase()
  await refreshShow(true)
  await refreshShow(false)
// =======

  process.stdout.write(`  測試版本 0\n`)
  await Migrate.execute(0)
  if (await Migrate.version() !== 0) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 null\n`)
  await Migrate.execute(null)
  if (await Migrate.version() !== 8) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 0\n`)
  await Migrate.execute(0)
  if (await Migrate.version() !== 0) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 null\n`)
  await Migrate.execute(null)
  if (await Migrate.version() !== 8) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 0\n`)
  await Migrate.execute(0, true)
  if (await Migrate.version() !== 0) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 null\n`)
  await Migrate.execute(null, true)
  if (await Migrate.version() !== 8) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 0\n`)
  await Migrate.execute(0, true)
  if (await Migrate.version() !== 0) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 null\n`)
  await Migrate.execute(null, true)
  if (await Migrate.version() !== 8) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

// =======

  process.stdout.write(`  測試版本 0\n`)
  await Migrate.execute(0)
  if (await Migrate.version() !== 0) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 3\n`)
  await Migrate.execute(3)
  if (await Migrate.version() !== 3) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 0\n`)
  await Migrate.execute(0)
  if (await Migrate.version() !== 0) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 3\n`)
  await Migrate.execute(3)
  if (await Migrate.version() !== 3) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 0\n`)
  await Migrate.execute(0, true)
  if (await Migrate.version() !== 0) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 3\n`)
  await Migrate.execute(3, true)
  if (await Migrate.version() !== 3) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 0\n`)
  await Migrate.execute(0, true)
  if (await Migrate.version() !== 0) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  process.stdout.write(`  測試版本 3\n`)
  await Migrate.execute(3, true)
  if (await Migrate.version() !== 3) { throw new Error('版本錯誤') }
  process.stdout.write(`  ➜ ok\n`)

  await Migrate.execute()
}
