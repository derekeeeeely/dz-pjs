const LinkList = require('./linkedlist')

class Queue{
  constructor() {
    this.list = new LinkList()
  }
  enqueue(value) {
    this.list.append(value)
  }
  dequeue() {
    this.list.deleteHead()
  }
  toString() {
    return this.list.toString()
  }
}

const q = new Queue()
q.enqueue(2)
q.enqueue(3)
console.log(q.toString())
q.dequeue()
console.log(q.toString())

module.exports = Queue
