const crypto = require('crypto')

// 同步
// function hash(password) {
//   const salt = crypto.randomBytes(128).toString('base64')
//   const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512')
//   return hash
// }

// console.time('pbkdf2Sync')
// for (let i = 0; i < 100; i++) {
//   hash('random_password')
// }
// console.timeEnd('pbkdf2Sync')

// 异步
function hash(password, cb) {
  const salt = crypto.randomBytes(128).toString('base64')
  crypto.pbkdf2(password, salt, 10000, 64, 'sha512', cb)
}

let count = 0
console.time('pbkdf2')
for (let i = 0; i < 100; i++) {
  hash('random_password', () => {
    count++
    if (count === 100) {
      console.timeEnd('pbkdf2')
    }
  })
}