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
