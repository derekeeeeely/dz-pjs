const LinkList = require('./linkedlist')

class Stack{
  constructor() {
    this.stacks = new LinkList()
  }
  pop() {
    const deletedNode = this.stacks.deleteTail()
    return deletedNode ? deletedNode.value : null
  }
  push(value) {
    this.stacks.append(value)
  }
  toArray() {
    return this.stacks.toArray().map(linkedNode => linkedNode.value).reverse()
  }
  toString() {
    return this.stacks.toString()
  }
}

const q = new Stack()
q.push(2)
q.push(3)
console.log(q.toString())
q.pop()
console.log(q.toString())

module.exports = Stack