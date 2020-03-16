class Queue {
  constructor() {
    this.items = []; // 存储数据
  }
  enqueue(item) { // 向队尾添加一个元素
    this.items.push(item);
  }
  dequeue() { // 删除队首的一个元素
    return this.items.shift();
  }
  head() { // 返回队首的元素
    return this.items[0];
  }
  tail() { // 返回队尾的元素
    return this.items[this.items.length - 1];
  }
  size() { // 返回队列的元素
    return this.items.length;
  }
  isEmpty() { // 返回队列是否为空
    return this.items.length === 0;
  }
  clear() { // 清空队列
    this.items = [];
  }
}