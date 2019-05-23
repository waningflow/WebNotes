# 题目

## 1. react 和 vue 的列表组件中 key 的作用

key 用于 virtual dom 的 diff 算法,具备相同的 key 被认为是同一个节点，直接更新，可以提升 diff 的效率

## 2. `['1', '2', '3'].map(parseInt)`结果

```js
;['1', '2', '3'].map((v, i) => parseInt(v, i))
parseInt('1', 0) //1
parseInt('2', 1) //NaN
parseInt('3', 1) //NaN
```

## 3. 防抖和节流的区别以及实现

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

## 4. Set、Map、WeakSet 和 WeakMap 的区别

WeakSet 的成员只能是对象，且都是弱引用，不计入垃圾回收机制。不可遍历
WeakMap 只接受对象作为键名（null 除外），且键名所指向的对象，不计入垃圾回收机制。不可遍历

## 5. 深度优先遍历和广度优先遍历实现

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
