class LinkNode {
  constructor(value, next = null) {
    this.value = value
    this.next = next
  }
  toString() {
    return this.value
  }
}

class LinkList {
  constructor() {
    this.head = null
    this.tail = null
  }
  append(value) {
    const newNode = new LinkNode(value)
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
      return this
    }
    this.tail.next = newNode
    this.tail = newNode
    return this
  }
  prepend(value) {
    const newNode = new LinkNode(value, this.head)
    if (!this.tail) {
      this.tail = newNode
      return this
    }
    this.head = newNode
    return this
  }
  delete(value) {
    if (!this.head) {
      return null
    }
    let deletedNode
    if (this.head.value === value) {
      deletedNode = this.head
      this.head = this.head.next
    }
    let cursor = this.head
    while (cursor.next) {
      if (cursor.next.value === value) {
        deletedNode = cursor.next
        cursor.next = cursor.next.next
      } else {
        cursor = cursor.next
      }
    }
    if (this.tail.value === value) {
      this.tail = cursor
    }
    return deletedNode
  }
  deleteHead() {
    if (!this.head) {
      return null
    }
    const deletedNode = this.head
    this.head = this.head.next || null
    this.tail = this.head.next ? this.tail : null
    return deletedNode
  }
  deleteTail() {
    const deletedNode = this.tail
    if (this.head === this.tail) {
      this.head = null
      this.tail = null
      return deletedNode
    }
    let cursor = this.head
    while(cursor.next) {
      if (cursor.next === this.tail) {
        cursor.next = null
      } else {
        cursor = cursor.next
      }
    }
    this.tail = cursor
    return deletedNode
  }
  find(value) {
    if (!this.head) {
      return null
    }
    let cursor = this.head
    while(cursor) {
      if (cursor.value === value) {
        return cursor
      } else {
        cursor = cursor.next
      }
    }
  }
  toArray() {
    const nodes = []
    let cursor = this.head
    while (cursor) {
      nodes.push(cursor)
      cursor = cursor.next
    }
    return nodes
  }
  toString() {
    return this.toArray().map(node => node.toString()).toString();
  }
}

class DoublyLinkNode {
  constructor(value, next = null, previous = null) {
    this.value = value
    this.next = next
    this.previous = previous
  }
  toString() {
    return this.value
  }
}

class DoublyLinkList {
  constructor() {
    this.head = null
    this.tail = null
  }
  append(value) {
    const newNode = new DoublyLinkNode(value)
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
      return this
    }
    this.tail.next = newNode
    newNode.previous = this.tail
    this.tail = newNode
    return this
  }
  prepend(value) {
    const newNode = new DoublyLinkNode(value)
    if (this.head) {
      this.head.previous = newNode
      newNode.next = this.head
      this.head = newNode
    }
    if (!this.tail) {
      this.tail = newNode
    }
    return this
  }
  delete(value) {
    if (!this.head) {
      return null
    }
    let deletedNode
    if (this.head.value === value) {
      deletedNode = this.head
      this.head = this.head.next
      this.head.previous = null
    }
    let cursor = this.head
    while (cursor.next) {
      if (cursor.next.value === value) {
        deletedNode = cursor.next
        cursor.next = cursor.next.next
        cursor.next.previous = cursor
      } else {
        cursor = cursor.next
      }
    }
    if (this.tail.value === value) {
      this.tail = cursor
    }
    return deletedNode
  }
  find(value) {
    if (!this.head) {
      return null
    }
    let cursor = this.head
    while (cursor) {
      if (cursor.value === value) {
        return cursor
      } else {
        cursor = cursor.next
      }
    }
  }
}

module.exports = LinkList
