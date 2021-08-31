/**
 * @author      OA Wu <comdan66@gmail.com>
 * @copyright   Copyright (c) 2015 - 2021, @oawu/orm
 * @license     http://opensource.org/licenses/MIT  MIT License
 * @link        https://www.ioa.tw/
 */

const Queue = require('@oawu/queue')

const { Migrate } = require('./index.js')

module.exports = Queue()
  
  .enqueue(next => next(process.stdout.write('測試 Migrate\n')))

  .enqueue(next => {
    process.stdout.write('  測試 version(closure)\n')
    Migrate.version((error, migrate) => {
      if (error)
        throw error
      else
        next(process.stdout.write('  ➜ ok\n'))
    })
  })

  .enqueue(next => {
    process.stdout.write('  測試 version(0, closure)\n')
    Migrate.version(0, (error, migrate) => {
      if (error)
        throw error
      else
        next(process.stdout.write('  ➜ ok\n'))
    })
  })

  .enqueue(next => {
    process.stdout.write('  測試 version(closure, false)\n')
    Migrate.version((error, migrate) => {
      if (error)
        throw error
      else
        next(process.stdout.write('  ➜ ok\n'))
    }, false)
  })

  .enqueue(next => {
    process.stdout.write('  測試 version(0, closure, false)\n')
    Migrate.version(0, (error, migrate) => {
      if (error)
        throw error
      else
        next(process.stdout.write('  ➜ ok\n'))
    }, false)
  })

  .enqueue(next => {
    process.stdout.write('  測試 version() promise\n')
    Migrate.version()
      .then(migrate => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  .enqueue(next => {
    process.stdout.write('  測試 version() async\n')
    const test = async _ => {
      const migrate = await Migrate.version()
      return migrate
    }
    test()
      .then(migrate => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  .enqueue(next => {
    process.stdout.write('  測試 version(0) promise\n')
    Migrate.version(0)
      .then(migrate => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  .enqueue(next => {
    process.stdout.write('  測試 version(0) async\n')
    const test = async _ => {
      const migrate = await Migrate.version(0)
      return migrate
    }
    test()
      .then(migrate => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  .enqueue(next => {
    process.stdout.write('  測試 version(false) promise\n')
    Migrate.version(false)
      .then(migrate => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  .enqueue(next => {
    process.stdout.write('  測試 version(false) async\n')
    const test = async _ => {
      const migrate = await Migrate.version(false)
      return migrate
    }
    test()
      .then(migrate => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  .enqueue(next => {
    process.stdout.write('  測試 version(0, false) promise\n')
    Migrate.version(0, false)
      .then(migrate => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  .enqueue(next => {
    process.stdout.write('  測試 version(0, false) async\n')
    const test = async _ => {
      const migrate = await Migrate.version(0, false)
      return migrate
    }
    test()
      .then(migrate => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  .enqueue(next => {
    process.stdout.write('  測試 refresh(closure)\n')
    Migrate.refresh((error, migrate) => {
      if (error)
        throw error
      else
        next(process.stdout.write('  ➜ ok\n'))
    })
  })

  .enqueue(next => {
    process.stdout.write('  測試 refresh(closure, false)\n')
    Migrate.refresh((error, migrate) => {
      if (error)
        throw error
      else
        next(process.stdout.write('  ➜ ok\n'))
    }, false)
  })

  .enqueue(next => {
    process.stdout.write('  測試 refresh() promise\n')
    Migrate.refresh()
      .then(migrate => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  .enqueue(next => {
    process.stdout.write('  測試 refresh() async\n')
    const test = async _ => {
      const migrate = await Migrate.refresh()
      return migrate
    }
    test()
      .then(migrate => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  .enqueue(next => {
    process.stdout.write('  測試 refresh(false) promise\n')
    Migrate.refresh(false)
      .then(migrate => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })

  .enqueue(next => {
    process.stdout.write('  測試 refresh(false) async\n')
    const test = async _ => {
      const migrate = await Migrate.refresh(false)
      return migrate
    }
    test()
      .then(migrate => next(process.stdout.write('  ➜ ok\n')))
      .catch(error => { throw error })
  })
