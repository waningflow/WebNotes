# Redux

要点

- 三大原则
  - 单一数据源。整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中
  - State 是只读的。唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象
  - 使用纯函数来执行修改。为了描述 action 如何改变 state tree ，你需要编写 reducers
- 与 Flux 相比
  - Redux 并没有 dispatcher 的概念，而是依赖纯函数来替代事件处理器
  - Redux 设想你永远不会变动你的数据，当 state 变化时需要返回全新的对象，而不是修改传入的参数
- 严格的单向数据流是 Redux 架构的设计核心
- Redux 应用中数据的生命周期：
  1. 调用 store.dispatch(action)
  2. Redux store 调用传入的 reducer 函数
  3. 根 reducer 应该把多个子 reducer 输出合并成一个单一的 state 树
  4. Redux store 保存了根 reducer 返回的完整 state 树
- 异步 Action
  - redux-thunk 中间件
- Middleware，位于 action 被发起之后，到达 reducer 之前的扩展点
  - 接收了一个 next() 的 dispatch 函数，并返回一个 dispatch 函数，返回的函数会被作为下一个 middleware 的 next()

示例

一个 redux 日志中间件

```js
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}
```

## redux-thunk

- 为什么需要 redux-thunk?[理由](https://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559)

## 源码分析

- combineReducers 函数,多 reducer 合并成一个 reducer
- createStore 函数，创建 store 对象，包含 getState, dispatch, subscribe, replaceReducer
- applyMiddleware 函数，重写 createStore，扩展 dispatch 函数
- compose 函数，实现多个函数嵌套调用(接收参数与返回值“相同”的函数，这里接收参数与返回值都是一个 dispatch 函数)

## 简单实现

```js
function creatStore(reducer, rewriteCreateStore) {
  let state = {}
  let listeners = []

  if (typeof rewriteCreateStore === 'function') {
    return rewriteCreateStore(creatStore)(reducer)
  }

  function subscribe(ber) {
    listeners.push(ber)
  }

  function getState() {
    return state
  }

  function dispatch(action) {
    state = reducer(state, action)
    listeners.forEach(ber => ber(state))
  }

  dispatch({
    type: Symbol('FALSE_ACTION')
  })

  return {
    getState: getState,
    dispatch: dispatch,
    subscribe: subscribe
  }
}

function combineReducer(reducers) {
  let keys = Object.keys(reducers)
  return function(state, action) {
    let newState = {}
    keys.forEach((k, i) => {
      newState[k] = reducers[k](state[k], action)
    })
    return newState
  }
}

function applyMiddleware(middlewares) {
  return creatStore => reducer => {
    let store = creatStore(reducer)
    middlewares = middlewares.slice()
    middlewares.reverse()

    let dispatch = store.dispatch
    middlewares.forEach(middleware => {
      dispatch = middleware(store)(dispatch)
    })

    return Object.assign({}, store, { dispatch })
  }
}

// 一个日志中间件

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

// 以下为测试内容

function dateReducer(state = '', action) {
  if (!action) {
    return state
  }
  switch (action.type) {
    case 'UPDATE_DATE':
      return action.value
    default:
      return state
  }
}

function timeReducer(state = '', action) {
  if (!action) {
    return state
  }
  switch (action.type) {
    case 'UPDATE_TIME':
      return action.value
    default:
      return state
  }
}

let reducers = combineReducer({
  date: dateReducer,
  time: timeReducer
})

let store = creatStore(reducers, applyMiddleware([logger]))

store.subscribe(() => {
  console.log(store.getState())
})

store.dispatch({
  type: 'UPDATE_DATE',
  value: new Date()
})
store.dispatch({
  type: 'UPDATE_TIME',
  value: new Date().getTime()
})
```
