# 题目

## react 和 vue 的列表组件中 key 的作用

key 用于 virtual dom 的 diff 算法,具备相同的 key 被认为是同一个节点，直接更新，可以提升 diff 的效率

## `['1', '2', '3'].map(parseInt)`结果

```js
;['1', '2', '3'].map((v, i) => parseInt(v, i))
parseInt('1', 0) //1
parseInt('2', 1) //NaN
parseInt('3', 1) //NaN
```

## 防抖和节流的区别以及实现

```js
function debunce(fun, t = 10) {
  let st
  return function(...args) {
    if (st) {
      clearTimeout(st)
    }
    st = setTimeout(_ => {
      fun.apply(this, args)
    }, t)
  }
}

function throttle(fun, t = 10) {
  let lastTime
  return function(...args) {
    let nowTime = Date.now()
    if (!lastTime || nowTime - lastTime > t) {
      fun.apply(this, args)
      lastTime = nowTime
    }
  }
}
```

## Set、Map、WeakSet 和 WeakMap 的区别

- WeakSet 的成员只能是对象，且都是弱引用，不计入垃圾回收机制。不可遍历
- WeakMap 只接受对象作为键名（null 除外），且键名所指向的对象，不计入垃圾回收机制。不可遍历

## 深度优先遍历和广度优先遍历实现

```js
let tree = [
  {
    name: 'p1',
    children: [
      {
        name: 'p11',
        children: [
          {
            name: 'p111'
          },
          {
            name: 'p112'
          }
        ]
      },
      {
        name: 'p12',
        children: [
          {
            name: 'p121',
            children: [
              {
                name: 'p1211'
              }
            ]
          },
          {
            name: 'p122'
          }
        ]
      }
    ]
  }
]

let res1 = []
function deepSearch(list) {
  list.forEach(v => {
    res1.push(v.name)
    if (v.children && v.children.length) {
      deepSearch(v.children)
    }
  })
}
deepSearch(tree)
console.log('deepSearch:' + res1)
// deepSearch:p1,p11,p111,p112,p12,p121,p1211,p122

function breadSearch(list) {
  let node = [...list]
  let res = []
  while (node.length) {
    let nd = node.shift()
    res.push(nd.name)
    if (nd.children && nd.children.length) {
      nd.children.forEach(v => {
        node.push(v)
      })
    }
  }
  return res
}
console.log('breadSearch:' + breadSearch(tree))
// breadSearch:p1,p11,p12,p111,p112,p121,p122,p1211
```

## 深拷贝实现

```js
// 简单递归实现，不考虑循环引用，正则，Symbol等
function deepcopy(obj) {
  if (!obj) {
    return obj
  }
  let item
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      item = obj.map(v => deepcopy(v))
    } else {
      item = {}
      Object.keys(obj).forEach(k => {
        item[k] = deepcopy(obj[k])
      })
    }
  } else {
    item = obj
  }
  return item
}

// DFS或BFS实现，考虑循环引用，不考虑正则，Symbol等
function copy(obj) {
  let rtn = {
    k: undefined
  }
  let stack = [
    {
      des: rtn,
      key: 'k',
      src: obj
    }
  ]
  let hash = new Map()
  while (stack.length) {
    console.log(rtn)
    let node = stack.pop()
    let { des, key, src } = node

    if (!src || typeof src !== 'object') {
      des[key] = src
      continue
    }
    if (hash.has(src)) {
      des[key] = hash.get(src)
      continue
    }
    if (Array.isArray(node.src)) {
      des[key] = []
      src.forEach((v, i) => {
        stack.push({
          des: des[key],
          key: i,
          src: v
        })
      })
    } else {
      des[key] = {}
      Object.keys(src).forEach(k => {
        stack.push({
          des: des[key],
          key: k,
          src: src[k]
        })
      })
    }
    hash.set(src, des[key])
  }
  return rtn.k
}
```

## ES5/ES6 的继承除了写法以外还有什么区别

- class 有 TDZ
- class 内部会启用严格模式
- class 所有方法（包括静态方法和实例方法）都是不可枚举的
- class 的所有方法（包括静态方法和实例方法）都没有 prototype 属性，不能使用 new 来调用
- 必须使用 new 调用 class
- class 内部无法重写类名

## 异步执行顺序问题

```js
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function() {
  console.log('setTimeout')
}, 0)
async1()
new Promise(function(resolve) {
  console.log('promise1')
  resolve()
}).then(function() {
  console.log('promise2')
})
console.log('script end')

// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```

## 数组扁平化

编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

```js
var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10]

function flatArr(arr) {
  return arr.reduce(
    (pre, cur) => pre.concat(Array.isArray(cur) ? flatArr(cur) : cur),
    []
  )
}

let res = [...new Set(flatArr(arr))].sort((a, b) => a - b)

console.log(res)
// [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]

// 其他方法
let res1 = [...new Set(arr.flat(Infinity))].sort((a, b) => a - b)
```

## 异步解决方案发展历程及优缺点

- 回调函数
  - 解决了同步的问题
  - 回调地狱，缺乏顺序性，缺乏可靠性。
  - 事件监听，可以绑定多个回调，可以"去耦合"，有利于实现模块化。但是变成事件驱动型，运行流程会变得很不清晰
  - 发布订阅
- Promise
  - 解决了回调地狱的问题
  - 不可撤销。错误只有在其链接的 promise 中可以捕获
- Generator
  - 配合 promise 或 thunk 函数，加上运行器，以同步的方式编写异步代码
- async/await
  - generator 函数的语法糖

## setState 执行问题(isBatchingUpdates)

```js
class Example extends React.Component {
  constructor() {
    super()
    this.state = {
      val: 0
    }
  }

  componentDidMount() {
    this.setState({ val: this.state.val + 1 })
    console.log(this.state.val) // 第 1 次 log

    this.setState({ val: this.state.val + 1 })
    console.log(this.state.val) // 第 2 次 log

    setTimeout(() => {
      this.setState({ val: this.state.val + 1 })
      console.log(this.state.val) // 第 3 次 log

      this.setState({ val: this.state.val + 1 })
      console.log(this.state.val) // 第 4 次 log
    }, 0)
  }

  render() {
    return null
  }
}
// 0
// 0
// 2
// 3
```

## 使用迭代实现 flatter 函数

```js
let arr = [1, 2, [3, 4, 5, [6, 7], 8], 9, 10, [11, [12, 13]]]

function flattern(list) {
  const stack = [...list]
  const des = []
  while (stack.length) {
    const next = stack.pop()
    if (Array.isArray(next)) {
      stack.push(...next)
    } else {
      des.push(next)
    }
  }
  return des.reverse()
}

console.log(flattern(arr))
```

## 下面代码中 a 在什么情况下会打印 1？

```js
var a = ?;
if(a == 1 && a == 2 && a == 3){
 	console.log(1);
}
```

```js
var a = {
  value: 1,
  valueOf() {
    return this.value++
  }
}
// or
var a = {
  value: 1,
  toString() {
    return this.value++
  }
}
// or
var a = {
  [Symbol.toPrimitive]: (value => () => value++)(1)
}
```

## vue 和 react 的区别

- vue 是一个框架，而 react 是一个库（框架与库之间最本质区别在于控制权：you call libs, frameworks call you）
- 从数据状态到 UI 渲染的差别
  - react 函数式编程思想（如 HOC，immutability，纯函数），react 的哲学是认为状态是不可变的，当试图修改状态的时候并不会重新渲染，必须手动 setState 才能触发渲染，并且会直接渲染整个节点树，可以通过 PureComponent 和 shouldComponentUpdate 来控制渲染过程，所有的优化要手动完成，折让数据流更加可预测
  - vue 中数据的变化会直接映射到 UI 的改变，除了对一些特殊情况比如嵌套对象添加属性以及数组的修改需要使用特殊方式触发
- 模板和样式
  - react 使用 JSX 来表示模板,本质上是 React.createElement 的语法糖。样式上有很多解决方案，比如 JSS 和 Styled components
  - vue 直接使用类 HTML 的 DSL 作为模板语言，样式直接写在 style 标签内，支持原生 css 以及 scss 等

## webpack, rollup 和 parcel 的区别

> 一句话概括：开发应用时用 webpack，开发库时用 rollup

- 打包工具
  - 代码打包
    - 模块化方式编写代码会产生很多文件，直接通过 script 标签依次引入会导致发出很多次请求，因此打包工具将所有的 js 文件整合进一个打包文件
  - 代码压缩
  - 热加载（HMR）
  - 代码拆分
- 设计初衷
  - webpack
    - 资源管理（可以包含任意类型的文件，甚至非 js 文件）
    - 代码拆分
  - rollup
    - 基于标准模块化方案（ES6）编写代码，通过去除 dead code 获取尽可能小的 bundle
  - parcel
    - 使用多线程加快打包速度
    - 零配置
- 配置
  - rollup 支持`import/export`语法，而 webpack 不支持
  - rollup 支持相对路径，而 webpack 不支持，要使用`path.resolve` 或 `path.join`
  - parcel 零配置
- 入口文件
  - webpack 仅支持 js 文件作为入口，对于其他格式（如 html）需要插件
  - rollup 将 html 作为入口也需要插件支持（如 rollup-plugin-html-entry）
  - parcel 可以将 html 作为入口，它会根据 script 标签自动检查
- 转化（将其他类型的文件转为 js）
  - webpack 使用 loader
  - rollup 使用插件
  - parcel 自动检测配置（`.babelrc`, `.postcssrc`, `.posthtmlrc`）并转化
- Tree Shaking（dead code elimination）
  - webpack
    - 使用 ES6 语法（import/export）
    - 在项目的`package.json`文件添加“sideEffects”入口
    - 使用一个支持“死码删除”的压缩插件（如 UglifyJSPlugin）
  - rollup 通过静态分析代码，排除没有使用的代码
  - parcel 不支持
- Dev Server
  - webpack 通过`webpack-dev-server`插件
  - rollup 通过`rollup-plugin-serve`和`rollup-plugin-livereload`
  - parcel 自带
- Hot Module Replacement(HMR，在运行时替换和增删模块而无需全体重新加载，加快开发速度)
  - webpack 的`webpack-dev-server`支持 `hot` 模式
  - rollup 不支持
  - parcel 自带
- 代码拆分
  - webpack 三种方式
    - 手动配置多个入口
    - 通过`CommonsChunkPlugin`去重
    - 动态导入，通过模块中的内联函数调用来分离代码
  - rollup 仅简单依赖浏览器自带的 ES 模块加载
  - parcel 通过`import()`语法

## redux 和 mobx 的区别

## 如何实现前端工程化

- 开发阶段（提交代码前）
  - 模块化开发，采用 ES6 模块化方案
  - 组件化开发，如 vue 的单文件组件
  - 代码规范
    - HTML，CSS，JavaScript 代码规范。通过 lint 工具规范代码，如使用统一的 ESlint，stylelint 配置
    - 文件命名规范
    - 项目文档规范
    - 组件规范
- precommit
  - lint 测试
  - 单元测试
- 部署阶段（CI/CD，提交代码后）
  - lint 测试，eslint
  - 单元测试，Jest, Enzyme
    - Jest
      - 运行速度快，并行测试多文件
      - 清晰操作简单
      - 开箱即用，有断言、spies、mocks
      - 默认创建全局环境，如“describe”已经在全局作用域，不用单独引入
      - 快照测试
      - 更强大的模块级 mocking 功能
      - 代码覆盖检查
      - Jest 仅仅更新被修改的文件，所以在监控模式 (watch mode) 下运行速度非常快
  - 功能测试， Codeceptjs, WebDriverIO
  - 视觉测试，Applitools
  - 兼容性測試，Sauce Labs
  - 部署
  - 持续集成，Travis CI

## 系统优化

- 根据权限动态加载路由，避免生成不必要的路由配置
- 根据路由按需加载组件，结合 webpack 的代码拆分，提高响应速度
- 所有请求通过“api”模块同一处理，各个功能模块有对应的 api 配置文件方便管理，全局统一添加超时以及错误提醒
