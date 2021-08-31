/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const DB       = require('./lib/DB.js')
const Migrate  = require('./lib/Migrate.js')

const Queue    = require('@oawu/queue')
const Xterm    = require('@oawu/xterm')
const Progress = require('@oawu/cli-progress')

Xterm.stringPrototype()
Progress.option.color = true

module.exports = {
  _cmd: (desc, action = null) => desc.lightGray.dim + (action !== null ? '：'.dim + action.lightGray.dim.italic : ''),
  _pad0: n => (n < 100 ? n < 10 ? '00' : '0' : '') + n,
  _check (done, fail, showLog) {
    return showLog  
      ? Queue()
        .enqueue(next => Progress.title('檢查 Migration Table 是否存在', this._cmd('Is Migration table exist?'))
          && DB.sql('show tables like "_Migration";')
            .catch(error => fail && fail(error, Progress.fail()))
            .then(tables => tables.length
              ? next(true, Progress.done())
              : next(false, Progress.fail('不存在'))))

        .enqueue((next, status) => status
          ? next()
          : Progress.title('建立 Migration Table', this._cmd('Create Migration table'))
            && DB.sql("CREATE TABLE `_Migration` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`version` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '版本',`updateAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',`createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '新增時間', PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
              .catch(error => fail && fail(error, Progress.fail()))
              .then(result => next(Progress.done())))
        
        .enqueue(next => Progress.title('取得 Migration Table 資料', this._cmd('Get Migration Table'))
          && DB.sql('SELECT * FROM `_Migration` limit 0,1;')
            .catch(error => fail && fail(error, Progress.fail()))
            .then(migrates => migrates.length
              ? next(migrates.shift(), Progress.done())
              : next(null, Progress.fail('沒資料'))))

        .enqueue((next, migrate) => migrate
          ? next(migrate)
          : Progress.title('新增 Migration Table 資料', this._cmd('Insert Migration table data'))
            && DB.sql('INSERT INTO `_Migration` (`version`) VALUES (0)')
              .catch(error => fail && fail(error, Progress.fail()))
              .then(result => next(null, Progress.done())))

        .enqueue((next, migrate) => migrate
          ? done(migrate)
          : Progress.title('取得 Migration Table 資料', this._cmd('Get Migration Table'))
            && DB.sql('SELECT * FROM `_Migration` limit 0,1;')
              .catch(error => fail && fail(error, Progress.fail()))
              .then(migrates => migrates.length
                ? done(migrates.shift(), Progress.done())
                : fail && fail(new Error('錯誤，不該發生的異常！'), Progress.fail('沒資料'))))
      : Queue()
        .enqueue(next => DB.sql('show tables like "_Migration";')
          .catch(fail)
          .then(tables => next(!!tables.length)))

        .enqueue((next, status) => status
          ? next()
          : DB.sql("CREATE TABLE `_Migration` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`version` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '版本',`updateAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',`createAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '新增時間', PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
            .catch(fail)
            .then(result => next()))

        .enqueue(next => DB.sql('SELECT * FROM `_Migration` limit 0,1;')
          .catch(fail)
          .then(migrates => next(migrates.shift())))

        .enqueue((next, migrate) => migrate
          ? next(migrate)
          : DB.sql('INSERT INTO `_Migration` (`version`) VALUES (0)')
            .catch(fail)
            .then(result => next(null)))

        .enqueue((next, migrate) => migrate
          ? done(migrate)
          : DB.sql('SELECT * FROM `_Migration` limit 0,1;')
            .catch(fail)
            .then(migrates => migrates.length
              ? done(migrates.shift())
              : fail && fail(new Error('錯誤，不該發生的異常！')))), this
  },
  version (version = null, closure = null, showLog = true) {
    if (typeof version == 'function')
      showLog = closure === null ? true : closure,
      closure = version,
      version = null

    if (typeof version == 'boolean')
      showLog = version,
      closure = null,
      version = null

    if (typeof closure == 'boolean')
      showLog = closure,
      closure = null

    const versions = migrate => {
      const files = DB.config.migrations
      const goal  = version !== null ? parseInt(version, 10) : parseInt(files[files.length - 1] && files[files.length - 1].version || 0, 10)
      const now   = parseInt(migrate.version, 10)

      return goal <= now
        ? goal == now
          ? { todos: [], isDown: 0 }
          : { todos: files.filter(file => file.version <= now && file.version > goal).map(file => ({ ...file, do: file.down })).reverse(), isDown: -1 }
        : { todos: files.filter(file => file.version > now && file.version <= goal).map(file => ({ ...file, do: file.up })), isDown: 0 }
    }

    const func = (version, closure, showLog) => showLog
      ? Queue()
        .enqueue(next => next(process.stdout.write("\n" + ' ' + '【取得 Migration 版本】'.yellow + "\n")))
        .enqueue(next => this._check(next, closure, showLog))
        .enqueue((next, migrate) => next(versions(migrate)))
        .enqueue((next, { todos, isDown = 0 }) => {
          const q = Queue()

          todos.length
            && process.stdout.write("\n" + ' ' + '【執行 Migration】'.yellow + "\n")
            && todos.forEach(todo => q.enqueue(next => Progress.title((isDown < 0 ? '調降'.lightRed : '更新'.lightCyan) + '至第 ' + this._pad0(todo.version + isDown).lightGray + ' 版', this._cmd('Migration up to ' + this._pad0(todo.version + isDown) + ' version'))
              && DB.sql(todo.do(Migrate))
                .catch(error => closure && closure(error, Progress.fail()))
                .then(_ => Progress.done().title('Migration 版號更新至第 ' + this._pad0(todo.version + isDown).lightGray.bold + ' 版', this._cmd('Migration version set ' + this._pad0(todo.version + isDown)))
                  && DB.sql('UPDATE `_Migration` SET `_Migration`.`version` = ' + (todo.version + isDown) + ' WHERE `_Migration`.`id` = 1')
                    .catch(error => closure && closure(error, Progress.fail()))
                    .then(_ => next(Progress.done())))))

          q.enqueue(n => DB.sql('SELECT * FROM `_Migration` limit 0,1;')
            .catch(closure)
            .then(migrates => migrates
              ? n(process.stdout.write([,
                  ' ' + '【完成 Migration 更新】'.yellow,
                  ' '.repeat(3) + '🎉 Yes! 已經完成版本更新！',
                  ' '.repeat(3) + '🚀 目前版本為' + '：'.gray.dim + this._pad0(migrates[0].version).lightGray,,,
                ].join("\n")), closure && closure(null, migrates[0]))
              : fail && fail(new Error('錯誤，不該發生的異常！'))))
        })
      : Queue()
        .enqueue(next => this._check(next, closure, showLog))
        .enqueue((next, migrate) => next(versions(migrate)))
        .enqueue((next, { todos, isDown = 0 }) => {
          const q = Queue()

          todos.length
            && todos.forEach(todo => q.enqueue(next => DB.sql(todo.do(Migrate))
              .catch(closure)
              .then(_ => DB.sql('UPDATE `_Migration` SET `_Migration`.`version` = ' + (todo.version + isDown) + ' WHERE `_Migration`.`id` = 1')
                .catch(closure)
                .then(next))))

          q.enqueue(n => DB.sql('SELECT * FROM `_Migration` limit 0,1;')
            .catch(closure)
            .then(migrates => closure && closure(null, migrates.shift())))
        })

    return closure
      ? (func(version, closure, showLog), this)
      : new Promise((resolve, reject) => func(version, (error, migrate) => error
        ? reject(error)
        : resolve(migrate), showLog))
  },
  refresh (closure = null, showLog = true) {
    if (typeof closure == 'boolean')
      showLog = closure,
      closure = null

    const down = migrate => {
      const now = parseInt(migrate.version, 10)
      return { migrate, todos: DB.config.migrations.filter(file => file.version <= now && file.version > 0).map(file => ({ ...file, do: file.down })).reverse(), isDown: -1 }
    }

    const up = migrate => {
      const files = DB.config.migrations
      const goal  = parseInt(files[files.length - 1] && files[files.length - 1].version || 0, 10)
      return { todos: files.filter(file => file.version > 0 && file.version <= goal).map(file => ({ ...file, do: file.up })), isDown: 0 }
    }

    const func = (closure, showLog) => showLog
      ? Queue()
        .enqueue(next => next(process.stdout.write("\n" + ' ' + '【取得 Migration 版本】'.yellow + "\n")))
        .enqueue(next => this._check(next, closure, showLog))
        .enqueue((next, migrate) => next(down(migrate)))
        .enqueue((next, { migrate, todos, isDown = 0 }) => {
          const q = Queue()

          todos.length
            && process.stdout.write("\n" + ' ' + '【執行 Migration】'.yellow + "\n")
            && todos.forEach(todo => q.enqueue(next => Progress.title((isDown < 0 ? '調降'.lightRed : '更新'.lightCyan) + '至第 ' + this._pad0(todo.version + isDown).lightGray + ' 版', this._cmd('Migration up to ' + this._pad0(todo.version + isDown) + ' version'))
              && DB.sql(todo.do(Migrate))
                .catch(error => closure && closure(error, Progress.fail()))
                .then(_ => Progress.done().title('Migration 版號更新至第 ' + this._pad0(todo.version + isDown).lightGray.bold + ' 版', this._cmd('Migration version set ' + this._pad0(todo.version + isDown)))
                  && DB.sql('UPDATE `_Migration` SET `_Migration`.`version` = ' + (todo.version + isDown) + ' WHERE `_Migration`.`id` = 1')
                    .catch(error => closure && closure(error, Progress.fail()))
                    .then(_ => next(Progress.done())))))

          q.enqueue(n => next(migrate))
        })
        .enqueue((next, migrate) => next(up(migrate)))
        .enqueue((next, { todos, isDown = 0 }) => {
          const q = Queue()

          todos.length
            && todos.forEach(todo => q.enqueue(next => Progress.title((isDown < 0 ? '調降'.lightRed : '更新'.lightCyan) + '至第 ' + this._pad0(todo.version + isDown).lightGray + ' 版', this._cmd('Migration up to ' + this._pad0(todo.version + isDown) + ' version'))
              && DB.sql(todo.do(Migrate))
                .catch(error => closure && closure(error, Progress.fail()))
                .then(_ => Progress.done().title('Migration 版號更新至第 ' + this._pad0(todo.version + isDown).lightGray.bold + ' 版', this._cmd('Migration version set ' + this._pad0(todo.version + isDown)))
                  && DB.sql('UPDATE `_Migration` SET `_Migration`.`version` = ' + (todo.version + isDown) + ' WHERE `_Migration`.`id` = 1')
                    .catch(error => closure && closure(error, Progress.fail()))
                    .then(_ => next(Progress.done())))))

          q.enqueue(n => DB.sql('SELECT * FROM `_Migration` limit 0,1;')
            .catch(closure)
            .then(migrates => migrates.length
              ? n(process.stdout.write([,
                  ' ' + '【完成 Migration 更新】'.yellow,
                  ' '.repeat(3) + '🎉 Yes! 已經完成版本更新！',
                  ' '.repeat(3) + '🚀 目前版本為' + '：'.gray.dim + this._pad0(migrates[0].version).lightGray,,,
                ].join("\n")), closure && closure(null, migrates[0]))
              : fail && fail(new Error('錯誤，不該發生的異常！'))))
        })

      : Queue()
        .enqueue(next => this._check(next, closure, showLog))
        .enqueue((next, migrate) => next(down(migrate)))
        .enqueue((next, { migrate, todos, isDown = 0 }) => {
          const q = Queue()

          todos.length
            && todos.forEach(todo => q.enqueue(next => DB.sql(todo.do(Migrate))
              .catch(closure)
              .then(_ => DB.sql('UPDATE `_Migration` SET `_Migration`.`version`=' + todo.version + isDown + ' WHERE `_Migration`.`id` = 1')
                .catch(closure)
                .then(next))))

          q.enqueue(n => next(migrate))
        })
        .enqueue((next, migrate) => next(up(migrate)))
        .enqueue((next, { todos, isDown = 0 }) => {
          const q = Queue()

          todos.length
            && todos.forEach(todo => q.enqueue(next => DB.sql(todo.do(Migrate))
              .catch(closure)
              .then(_ => DB.sql('UPDATE `_Migration` SET `_Migration`.`version`=' + todo.version + isDown + ' WHERE `_Migration`.`id` = 1')
                .catch(closure)
                .then(next))))

          q.enqueue(n => DB.sql('SELECT * FROM `_Migration` limit 0,1;')
            .catch(closure)
            .then(migrates => closure && closure(null, migrates.shift())))
        })

    return closure
      ? (func(closure, showLog), this)
      : new Promise((resolve, reject) => func((error, migrate) => error
        ? reject(error)
        : resolve(migrate), showLog))
  }
}
