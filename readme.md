# OA's Node.js MySQL ORM

來吧，Node.js 的 ORM，這次還包含了 Migration 喔！ 📚

## 說明
製作個人的 [Node.js](https://nodejs.org/en/) [MySQL](https://www.mysql.com/) [ORM](https://zh.wikipedia.org/zh-tw/%E5%AF%B9%E8%B1%A1%E5%85%B3%E7%B3%BB%E6%98%A0%E5%B0%84) 功能，功能包含 Migration 與 ORM Model，ORM 提供了 create、update、delete、search... 等功能。

## 安裝

```shell
npm install @oawu/mysql-orm
```

## 使用

### 設定

首先先制定連線方式：

1. connect：填入連線方式即可
2. migrationsDir：若要使用 Migration 來記錄版本，則指定放置的檔案目錄即可
3. modelsDir：指定 Model 目錄，便可以使用該目錄下的 ORM Model
4. queryLogDir：紀錄查詢資料庫的 SQL 語法與執行耗時

```javascript

  const { Config } = require('@oawu/mysql-orm')

  // 設定連線方式

  Config.connect = {
    host: "127.0.0.1",
    user: "root",
    password: "1234",
    database: "php-orm",
    port: 3306
  }

  // Migration 檔案位置
  Config.migrationsDir = __dirname + '/migrations/'

  // Model 檔案位置
  Config.modelsDir = __dirname + '/models/'

  // Log 檔案位置
  Config.queryLogDir = __dirname + '/logs/'

```

### Migration

新增 Migration，以 `3位數版本號碼-敘述` 為規格，以下為 `001-create User.js` 範例

```javascript

  module.exports = {
    up (db) {
      db = db.create('User', '使用者')
      db.attr('id').int().unsigned().notNull().autoIncrement().comment('ID')

      db.attr('name').varchar(190).collate('utf8mb4_unicode_ci').notNull().comment('名稱')
      db.attr('sex').enum('male', 'female').collate('utf8mb4_unicode_ci').default(null).comment('性別')
      db.attr('height').decimal(5, 2).unsigned().default(null).comment('身高')
      db.attr('bio').text().collate('utf8mb4_unicode_ci').notNull().comment('個人簡歷')

      db.attr('updateAt').datetime().notNull().default('CURRENT_TIMESTAMP').on('update', 'CURRENT_TIMESTAMP').comment('更新時間')
      db.attr('createAt').datetime().notNull().default('CURRENT_TIMESTAMP').comment('新增時間')

      db.primaryKey('id')
      return db
    },
    down: db => db.drop('User')
  }

```

### 更新 Migration

使用 Migrate 的 version 函式，即可自動更新至最新版本。

若想指定版本號碼，可以直接帶入版本參數如 `Migrate.version(1)`

參數分別有三個：

1. 版本號碼，若不給予代表更新至最新
2. callback function，若不給予則以 `Promise` 形式回傳
3. 是否顯示更新紀錄，預設為 `true`

```javascript

  const { Migrate } = require('@oawu/mysql-orm')

  // 更新至最新，使用 callback 方式執行
  Migrate.version(data => {
    if (data instanceof Error)
      console.error(data) // error
    else
      console.error(data) // migrate
  })

  // 更新至第 0 版，使用 Promise 方式執行
  Migrate.version(0)
    .then(migrate => {
      console.error(migrate)
    })
    .catch(error => {
      console.error(error)
    })

```

### 使用 Model

於指定的 Model 目錄內新增 `User.js` 檔案

```javascript

  const User = function() {}
  module.exports = User

```

Model 都有提供兩種模式，如果 callback 參數未給予，則會以 `Promise` 方式做回傳。

1. callback
2. Promise

#### 新增

```javascript

  const { Model } = require('@oawu/mysql-orm')

  // callback
  Model.User.create({ name: 'OA', sex: 'male', height: 171.1, bio: 'test' }, data => {
    if (data instanceof Error)
      console.error(data) // error
    else
      console.error(data) // user
  })

  // Promise
  Model.User.create({ name: 'OA', sex: 'male', height: 171.1, bio: 'test' })
    .then(user => {
      console.error(user)
    })
    .catch(error => {
      console.error(error)
    })

```

#### 查詢

```javascript

  const { Model } = require('@oawu/mysql-orm')

  // 多筆查詢
  // callback
  Model.User.all(data => {
    if (data instanceof Error) console.error(data) // error
    else console.error(data) // users
  })

  // Promise
  Model.User.all()
    .then(users => console.error(users))
    .catch(error => console.error(error))

  // 單筆查詢
  Model.User.one(data => {
    if (data instanceof Error) console.error(data) // error
    else console.error(data) // user
  })

  // 條件式查詢
  Model.User.where(1).all(data => { // id == 1
    if (data instanceof Error) console.error(data) // error
    else console.error(data) // users
  })
  Model.User.where('id', '>', 1).all(data => { // id > 1
    if (data instanceof Error) console.error(data) // error
    else console.error(data) // users
  })
  Model.User.where('name', 'LIKE', '%OA%').all(data => { // name like %OA%
    if (data instanceof Error) console.error(data) // error
    else console.error(data) // users
  })
  Model.User.where({ id: [1, 2, 3] }).all(data => { // id in [1, 2, 3]
    if (data instanceof Error) console.error(data) // error
    else console.error(data) // users
  })
  Model.User.where('name', 'LIKE', '%OA%').where([1, 2, 3]).all(data => { // name like %OA% AND id in [1, 2, 3]
    if (data instanceof Error) console.error(data) // error
    else console.error(data) // users
  })
  Model.User.where('name', 'LIKE', '%OA%').orWhere({ id: [1, 2, 3] }).all(data => { // name like %OA% OR id in [1, 2, 3]
    if (data instanceof Error) console.error(data) // error
    else console.error(data) // users
  })

  // 其他查詢
  Model.User.offset(1).limit(3).order('id DESC').select('name').all(data => {
    if (data instanceof Error) console.error(data) // error
    else console.error(users)
  })
  Model.User.select({ name: 'na' }).all((error, users) => {
    if (data instanceof Error) console.error(data) // error
    else console.error(data) // users
  })

```

#### 更新

```javascript

  const { Model } = require('@oawu/mysql-orm')

  // 多筆、條件式更新
  // callback
  Model.User.update({ name: 'oa' }, (error, count) => { // count 為影響的數量
    if (data instanceof Error) console.error(data) // error
    else console.error(data) // count
  })

  // Promise
  Model.User.where('id', '>', 10).update({ name: 'oa' })
    .then(count => console.error(users)) // count 為影響的數量
    .catch(error => console.error(error))

  // 單筆 save 更新，一樣分成 callback、Promise
  Model.User.one((error, user) => {
    if (data instanceof Error) console.error(data) // error
    const user = data
    user.name = 'oa'

    // callback
    user.save((error, user) => {
      if (data instanceof Error) console.error(data) // error
      else console.error(data) // user
    })
    // Promise
    user.save()
      .then(user => console.error(user))
      .catch(error => console.error(error))
  })

```

#### 刪除

```javascript

  const { Model } = require('@oawu/mysql-orm')

  // 多筆、條件式刪除
  // callback
  Model.User.delete((error, count) => { // count 為影響的數量
    if (data instanceof Error) console.error(data) // error
    else console.error(data) // count
  })

  // Promise
  Model.User.where('id', '>', 10).delete()
    .then(count => console.error(users)) // count 為影響的數量
    .catch(error => console.error(error))

  // 單筆 save 更新，一樣分成 callback、Promise
  Model.User.one((error, user) => {
    if (data instanceof Error) console.error(data) // error
    const user = data
    user.name = 'oa'

    // callback
    user.delete((error, user) => {
      if (data instanceof Error) console.error(data) // error
      else console.error(data) // user
    })
    // Promise
    user.delete()
      .then(user => console.error(user))
      .catch(error => console.error(error))
  })

```
