/**
 * @author      OA Wu <oawu.tw@gmail.com>
 * @copyright   Copyright (c) 2015 - 2025, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const FileSystem = require('fs/promises')
const Xterm      = require('@oawu/xterm')
const Progress   = require('@oawu/cli-progress')

const DB       = require('./lib/DB.js')
const Config   = require('./lib/Config.js')
const Migrate  = require('./lib/Migrate.js')

const { closureOrPromise, Type: T, tryIgnore, Str: { pad } } = require('@oawu/helper')

Xterm.stringPrototype()
Progress.option.color = true

const _cmd = (desc, action = null) => desc.lightGray.dim + (action !== null ? '：'.dim + action.lightGray.dim.italic : '')

const _migrate = async _ => {
  const migrates = await tryIgnore(DB.sql('SELECT * FROM `_Migration` limit 0,1;'))
  return T.error(migrates) ? null : migrates.shift()
}
const _migrateShowLog = async _ => {
  Progress.title('檢查 Migration Table 是否存在', _cmd('Is Migration table exist?'))
  const tables = await tryIgnore(DB.sql('show tables like "_Migration";'))
  if (T.error(tables)) {
    Progress.fail()
    throw tables
  }

  if (tables.length <= 0) {
    Progress.fail('不存在')

    Progress.title('建立 Migration Table', _cmd('Create Migration table'))
    const result = await tryIgnore(DB.sql("CREATE TABLE `_Migration` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`version` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '版本',`updateAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',`createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '新增時間', PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"))
    if (T.error(result)) {
      Progress.fail()
      throw result
    }
    Progress.done()
  } else {
    Progress.done()
  }

  Progress.title('取得 Migration Table 資料', _cmd('Get Migration Table'))
  const migrates = await tryIgnore(DB.sql('SELECT * FROM `_Migration` limit 0,1;'))
  if (T.error(migrates)) {
    Progress.fail()
    throw migrates
  }
  Progress.done()

  const migrate = migrates.shift()

  if (migrate) {
    return migrate
  }

  Progress.title('新增 Migration Table 資料', _cmd('Insert Migration table data'))
  const result = await tryIgnore(DB.sql('INSERT INTO `_Migration` (`version`) VALUES (0)'))
  if (T.error(result)) {
    Progress.fail()
    throw result
  }
  Progress.done()

  Progress.title('取得 Migration Table 資料', _cmd('Get Migration Table'))
  const _migrates = await tryIgnore(DB.sql('SELECT * FROM `_Migration` limit 0,1;'))
  if (T.error(_migrates)) {
    Progress.fail()
    throw _migrates
  }
  Progress.done()

  const _migrate = _migrates.shift()
  if (_migrate) {
    return _migrate
  }

  throw new Error('錯誤，不該發生的異常！')
}
const _migrateHideLog = async _ => {
  const tables = await DB.sql('show tables like "_Migration";')
  if (tables.length <= 0) {
    await DB.sql("CREATE TABLE `_Migration` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`version` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '版本',`updateAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',`createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '新增時間', PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
  }

  const m = await _migrate()
  if (m) {
    return m
  }

  await DB.sql('INSERT INTO `_Migration` (`version`) VALUES (0)')

  const _m = await _migrate()
  if (_m) {
    return _m
  }

  throw new Error('錯誤，不該發生的異常！')
}
const _versions = async version => {
  const dir = Config.migrationsDir

  const migrate = await _migrate()
  let _migrations = dir !== null ? await tryIgnore(FileSystem.readdir(dir), []) : []

  const migrations = _migrations.map(_file => {
      const file = /^(?<version>[0-9]+)\-(?<name>.*)\.js$/ig.exec(_file)
      if (file === null) {
        return null
      }

      let migrate = null
      try { migrate = require(`${dir}${file.groups.version}-${file.groups.name}.js`) }
      catch (e) { migrate = null }

      if (migrate === null) {
        return null
      }

      return {
        version: file.groups.version * 1,
        title: file.groups.name,
        up: migrate.up,
        down: migrate.down
      }
    })
    .filter(t => t !== null)
    .sort((a, b) => a.version - b.version)

  const files = migrations
  const goal = (version !== null ? version : (files[files.length - 1] && files[files.length - 1].version || 0)) * 1
  const now = migrate.version * 1

  return goal <= now
    ? goal == now
      ? { todos: [], isDown: 0 }
      : { todos: files.filter(file => file.version <= now && file.version > goal).map(file => ({ ...file, do: file.down })).reverse(), isDown: -1 }
    : { todos: files.filter(file => file.version > now && file.version <= goal).map(file => ({ ...file, do: file.up })), isDown: 0 }
}

const _executeArgvs = (...argvs) => {
  let version = null
  let showLog = false
  let closure = null

  const a1 = argvs.shift()
  const a2 = argvs.shift()
  const a3 = argvs.shift()

  const v = v => (T.num(v) || v === null)
  const s = v => T.bool(v)
  const c = v => (T.func(v) || v === null)

  if (a1 === undefined) {
    return { version, showLog, closure }
  }

  if (a2 === undefined) {
    if (v(a1)) { version = a1 }
    if (s(a1)) { showLog = a1 }
    if (c(a1)) { closure = a1 }
    return { version, showLog, closure }
  }
  if (a3 === undefined) {
    if (v(a1) && s(a2)) { version = a1, showLog = a2 }
    if (v(a1) && c(a2)) { version = a1, closure = a2 }
    if (s(a1) && v(a2)) { showLog = a1, version = a2 }
    if (s(a1) && c(a2)) { showLog = a1, closure = a2 }
    if (c(a1) && v(a2)) { closure = a1, version = a2 }
    if (c(a1) && s(a2)) { closure = a1, showLog = a2 }
    return { version, showLog, closure }
  }

  if (v(a1) && s(a2) && c(a3)) { vrsion = a1, showLog = a2, closure = a3 }
  if (v(a1) && c(a2) && s(a3)) { vrsion = a1, closure = a2, showLog = a3 }
  if (s(a1) && v(a2) && c(a3)) { showLog = a1, version = a2, closure = a3 }
  if (s(a1) && c(a2) && v(a3)) { showLog = a1, closure = a2, version = a3 }
  if (c(a1) && v(a2) && s(a3)) { closure = a1, version = a2, showLog = a3 }
  if (c(a1) && s(a2) && v(a3)) { closure = a1, showLog = a2, version = a3 }
  return { version, showLog, closure }
}
const execute = (...argvs) => {
  const { version, showLog, closure } = _executeArgvs(...argvs)

  return closureOrPromise(closure, async _ => {
    if (showLog) {
      process.stdout.write(`\n ${'【取得 Migration 版本】'.yellow}\n`)
      await _migrateShowLog()
      const { todos, isDown = 0 } = await _versions(version);

      if (todos.length) {
        process.stdout.write(`\n ${'【執行 Migration】'.yellow}\n`)

        for (const todo of todos) {
          Progress.title(`${isDown < 0 ? '調降'.lightRed : '更新'.lightCyan}至第${pad(todo.version + isDown, 3).lightGray} 版`, _cmd(`Migration up to ${pad(todo.version + isDown)} version`))

          let sqls = todo.do(Migrate)
          if (T.str(sqls) || T.obj(sqls)) {
            sqls = [sqls]
          }

          if (T.arr(sqls)) {
            for (const sql of sqls) {
              let result = await tryIgnore(DB.sql(sql))
              if (T.error(result)) {
                Progress.fail()
                throw result
              }
            }
          }

          Progress.done()

          Progress.title(`Migration 版號更新至第 ${pad(todo.version + isDown, 3).lightGray.bold} 版`, _cmd(`Migration version set ${pad(todo.version + isDown, 3)}`))
          result = await tryIgnore(DB.sql('UPDATE `_Migration` SET `_Migration`.`version` = ' + (todo.version + isDown) + ' WHERE `_Migration`.`id` = 1'))
          if (T.error(result)) {
            Progress.fail()
            throw result
          }
          Progress.done()
        }
      }

      const migrate = await _migrate()
      if (!migrate) {
        throw new Error('錯誤，不該發生的異常！')
      }

      process.stdout.write([,
        ` ${'【完成 Migration 更新】'.yellow}`,
        `${' '.repeat(3)}🎉 Yes! 已經完成版本更新！`,
        `${' '.repeat(3)}🚀 目前版本為${'：'.gray.dim}${pad(migrate.version, 3).lightGray}`,,,
      ].join("\n"))

      return migrate
    } else {
      await _migrateHideLog()
      const { todos, isDown = 0 } = await _versions(version);

      for (const todo of todos) {

        let sqls = todo.do(Migrate)
        if (T.str(sqls) || T.obj(sqls)) {
          sqls = [sqls]
        }

        if (T.arr(sqls)) {
          for (const sql of sqls) {
            await DB.sql(sql)
          }
        }

        await DB.sql('UPDATE `_Migration` SET `_Migration`.`version` = ' + (todo.version + isDown) + ' WHERE `_Migration`.`id` = 1')
      }

      const migrate = await _migrate()
      if (!migrate) {
        throw new Error('錯誤，不該發生的異常！')
      }
      return migrate
    }
  })
}

const _refresh = (...argvs) => {
  let showLog = false
  let closure = null

  const a1 = argvs.shift()
  const a2 = argvs.shift()

  const s = v => T.bool(v)
  const c = v => (T.func(v) || v === null)

  if (a1 === undefined) {
    return { showLog, closure }
  }

  if (a2 === undefined) {
    if (s(a1)) { showLog = a1 }
    if (c(a1)) { closure = a1 }
    return { showLog, closure }
  }

  if (s(a1) && c(a2)) { showLog = a1, closure = a2 }
  if (c(a1) && s(a2)) { closure = a1, showLog = a2 }
  return { showLog, closure }
}
const refresh = (...argvs) => {
  const { showLog, closure } = _refresh(...argvs)

  return closureOrPromise(closure, async _ => {
    if (showLog) {
      process.stdout.write(`\n ${'【取得 Migration 版本】'.yellow}\n`)
      await _migrateShowLog()

      const run = async ({ todos, isDown = 0 }) => {
        if (todos.length) {

          for (const todo of todos) {
            Progress.title(`${isDown < 0 ? '調降'.lightRed : '更新'.lightCyan}至第${pad(todo.version + isDown, 3).lightGray} 版`, _cmd(`Migration up to ${pad(todo.version + isDown, 3)} version`))

            let sqls = todo.do(Migrate)
            if (T.str(sqls) || T.obj(sqls)) {
              sqls = [sqls]
            }

            if (T.arr(sqls)) {
              for (const sql of sqls) {
                let result = await tryIgnore(DB.sql(sql))
                if (T.error(result)) {
                  Progress.fail()
                  throw result
                }
              }
            }
            Progress.done()

            Progress.title(`Migration 版號更新至第 ${pad(todo.version + isDown, 3).lightGray.bold} 版`, _cmd(`Migration version set ${pad(todo.version + isDown, 3)}`))
            result = await tryIgnore(DB.sql('UPDATE `_Migration` SET `_Migration`.`version` = ' + (todo.version + isDown) + ' WHERE `_Migration`.`id` = 1'))
            if (T.error(result)) {
              Progress.fail()
              throw result
            }
            Progress.done()
          }
        }
      }

      process.stdout.write(`\n ${'【執行 Migration】'.yellow}\n`)
      await run(await _versions(0))
      await run(await _versions(null))

      const migrate = await _migrate()
      if (!migrate) {
        throw new Error('錯誤，不該發生的異常！')
      }

      process.stdout.write([,
        ` ${'【完成 Migration 更新】'.yellow}`,
        `${' '.repeat(3)}🎉 Yes! 已經完成版本更新！`,
        `${' '.repeat(3)}🚀 目前版本為${'：'.gray.dim}${pad(migrate.version, 3).lightGray}`,,,
      ].join("\n"))

      return migrate
    } else {
      await _migrateHideLog()

      const run = async ({ todos, isDown = 0 }) => {
        for (const todo of todos) {

          let sqls = todo.do(Migrate)
          if (T.str(sqls) || T.obj(sqls)) {
            sqls = [sqls]
          }

          if (T.arr(sqls)) {
            for (const sql of sqls) {
              await tryIgnore(DB.sql(sql))
            }
          }

          await DB.sql('UPDATE `_Migration` SET `_Migration`.`version` = ' + (todo.version + isDown) + ' WHERE `_Migration`.`id` = 1')
        }
      }

      await run(await _versions(0))
      await run(await _versions(null))

      const migrate = await _migrate()
      if (!migrate) {
        throw new Error('錯誤，不該發生的異常！')
      }
      return migrate
    }
  })
}

module.exports = {
  version: async _ => {
    const migrate = await _migrate()
    return 1 * migrate.version
  },
  execute,
  refresh,
}
