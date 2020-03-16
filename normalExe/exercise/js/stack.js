class Stack {
  constructor() {
    this.items = []; // 使用数组存储数据
  }
  push(item) {
    this.items.push(item); // 往栈里压入一个元素
  }
  pop() {
    return this.items.pop(); // 把栈顶的元素移除
  }
  top() {
    return this.items[this.items.length - 1]; // 返回栈顶的元素
  }
  isEmpty() {
    return this.items.length === 0; //返回栈是否为空
  }
  size() {
    return this.items.length; // 返回栈的大小
  }
  clear() {
    this.items = []; // 清空栈
  }
}