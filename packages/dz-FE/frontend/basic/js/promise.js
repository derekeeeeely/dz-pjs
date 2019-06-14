
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class Pro {
  constructor(fn) {
    this.value = null
    this.reason = null
    this.status = PENDING
    this.onFulFilledcbs = []
    this.onRejectedcbs = []

    let reject = (reason) => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.reason = reason
          this.status = REJECTED
          this.onRejectedcbs.forEach(item => item(this.reason))
        }
      }, 0);
    }

    let resolve = (value) => {
      if (value instanceof Pro) {
        console.log('step6: 如果是promise，调用then')
        value.then(resolve, reject)
      }
      setTimeout(() => {
        if (this.status === PENDING) {
          this.value = value
          this.status = FULFILLED
          console.log('step6: 改变value和状态，传入value执行注册好的回调')
          this.onFulFilledcbs.forEach(item => item(this.value))
        }
      }, 0);
    }

    try {
      console.log('step1: 执行函数，传入resolve和reject')
      fn(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }


  then(onFulFilled, onRejected) {
    console.log('step3: 实例生成后，调用then方法')
    let self = this
    if (typeof onFulFilled !== 'function') {
      onFulFilled = (value) => {
        return value
      }
    }
    if (typeof onRejected !== 'function') {
      onRejected = (reason) => {
        throw reason
      }
    }
    if (self.status === FULFILLED) {
      return new Pro((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onFulFilled(self.value)
            if (x instanceof Pro) {
              x.then(resolve, reject)
            } else {
              resolve(x)
            }
          } catch (error) {
            reject(error)
          }
        }, 0);
      })
    }
    if (self.status === REJECTED) {
      return new Pro((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onRejected(self.reason)
            if (x instanceof Pro) {
              x.then(resolve, reject)
            } else {
              resolve(x)
            }
          } catch (error) {
            reject(error)
          }
        }, 0);
      })
    }
    if (self.status === PENDING) {
      console.log('step4: pending状态，push回调函数')
      return new Pro((resolve, reject) => {
        self.onFulFilledcbs.push(() => {
          let x = onFulFilled(self.value)
          if (x instanceof Pro) {
            x.then(resolve, reject)
          } else {
            resolve(x)
          }
        })
        self.onRejectedcbs.push(() => {
          let x = onRejected(self.reason)
          if (x instanceof Pro) {
            x.then(resolve, reject)
          } else {
            resolve(x)
          }
        })
      })
    }
  }

  catch(fn) {
    let self = this
    return self.then(null, fn)
  }
}

var test = new Pro((resolve, reject) => {
  console.log('step2：执行传入函数')
  // resolve(123)
  setTimeout(() => {
    console.log('step5: 异步完成，执行resolve')
    resolve(111)
  }, 2000)
}).then(data => {
  console.log('step7: 执行回调函数')
  console.log(data)
  return new Pro((resolve, reject) => {
    setTimeout(() => {
      resolve(data+111)
    }, 2000)
  })
}).then(data => {
  console.log(data+111)
})

// console.log('end')
