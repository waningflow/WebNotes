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

## 源码分析

- combineReducers 函数,接收一个对象，将参数过滤后返回一个函数。该函数里有一个过滤参数后的对象 finalReducers，遍历该对象，然后执行对象中的每一个 reducer 函数，最后将新的 state 返回
  - assertReducerShape 函数，检查初始化的值是否为 undefined
  - getUnexpectedStateShapeWarningMessage 函数，检查一些错误

_TBD_
