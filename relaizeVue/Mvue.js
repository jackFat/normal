
const compileUtil = {
  getVal(expr, vm) {
    return expr.split('.').reduce((data, currentValue) => {
      return data[currentValue]
    }, vm.$data)
  },

  setVal(expr, vm, inputVal) {
    return expr.split('.').reduce((data, currentVal) => {
      data[currentVal] = inputVal
    }, vm.$data)
  },

  getContextVal(expr, vm) {
    return expr.replace(/{\{(.+?)\}\}/g, (...args) => {
      return this.getVal(args[1], vm)
    })
  },

  text(node,expr, vm) {
    let value
    if (/{\{(.+?)\}\}/.test(expr)) {
      value = expr.replace(/{\{(.+?)\}\}/g, (...args) => {
        new Watcher(vm, args[1], (newVal) => {
          this.updater.textUpdater(node, this.getContextVal(expr, vm))
        })
        return this.getVal(args[1], vm)
      })
    } else {
      value = this.getVal(expr, vm)
    }
    this.updater.textUpdater(node, value)
  },

  html(node, expr, vm) {
    const value = this.getVal(expr, vm)
    
    new Watcher(vm, expr, (newVal) => {
      this.updater.htmlUpdater(node, newVal)
    })

    this.updater.htmlUpdater(node, value)
  },

  model(node, expr, vm) {
    const value = this.getVal(expr, vm)

    new Watcher(vm, expr, (newVal) => {
      this.updater.modelUpdater(node, newVal)
    })

    // 视图=>数据=>视图
    node.addEventListener('input', e => {
      this.setVal(expr, vm, e.target.value)
    })

    this.updater.modelUpdater(node, value)
  },

  on(node, expr, vm, eventName) {
    let fn = vm.$options.methods && vm.$options.methods[expr]
    node.addEventListener(eventName,fn.bind(vm),false)
  },

  bind(node, expr, vm, eventName) {
    node.setAttribute(eventName, expr)
  },

  updater: {
    textUpdater(node, value) {
      node.textContent = value
    },
    htmlUpdater(node, value) {
      node.innerHTML = value
    },
    modelUpdater(node, value) {
      node.value = value
    }
  }
}

class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
    // 获取文档碎片对象，放入内存中会减少页面的回流和重绘
    const fragment = this.node2Fragment(this.el)
    // console.log(fragment)

    // 编译节点
    this.compile(fragment)

    // 向根元素中添加节点
    this.el.appendChild(fragment)
  }

  compile(fragment) {
    const childNodes = fragment.childNodes;
    [...childNodes].forEach(child => {
      if (this.isElementNode(child)) {
        // 是元素节点
        // 编译元素节点
        // console.log('元素节点', child)
        this.compileElement(child)
      } else {
        // 文本节点
        // 编译文本节点
        // console.log('文本节点', child)
        this.compileText(child)
      }
      if (child.childNodes && child.childNodes.length) {
        this.compile(child)
      }
    })
  }

  compileElement(node) {
    const attributes = node.attributes;
    // console.log(attributes);
    [...attributes].forEach(attr => {
      const {name, value} = attr
      if (this.isDirective(name)) {
        const [, directive] = name.split('-')
        const [directiveName, eventName] = directive.split(':')

        // 编译数据驱动视图
        compileUtil[directiveName](node, value, this.vm, eventName)

        // 删除页面中的指令标签
        node.removeAttribute('v-' + directiveName)
      } else if (this.isEventName(name)) {
        const [, eventName] = name.split('@')
        compileUtil['on'](node, value, this.vm, eventName)
      }
    })
  }

  compileText(node) {
    const content = node.textContent
    if (/\{\{(.+?)\}\}/.test(content)) {
      console.log(content);
      compileUtil['text'](node, content, this.vm)
    }
  }

  isEventName(attrName) {
    return attrName.startsWith('@')
  }

  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  
  isElementNode(node) {
    return node.nodeType === 1
  }

  node2Fragment(el) {
    // 创建文档碎片
    const f = document.createDocumentFragment()
    let firstChild
    while (firstChild = el.firstChild) {
      f.appendChild(firstChild)
    }
    return f
  }
  
}


class Mvue {
  constructor(options) {
    this.$el = options.el
    this.$data = options.data
    this.$options = options

    if (this.$el) {
      // 实现一个数据观察者
      new Observer(this.$data)
      // 实现一个指令解析器
      new Compile(this.$el, this)

      // 代理
      this.proxyData(this.$data)
    }
  }

  proxyData(data) {
    for(const key in data) {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newVal) {
          data[key] = newVal
        }
      })
    }
  }
}