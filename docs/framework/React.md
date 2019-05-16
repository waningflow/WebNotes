# React

## 生命周期

- Reconciliation 阶段, 可以被打断, `componentWillMount`,`componentWillReceiveProps`,`shouldComponentUpdate`,`componentWillUpdate`
- Commit 阶段,不能暂停,会一直更新界面直到完成,`componentDidMount`,`componentDidUpdate`,`componentWillUnmount`

```js
class ExampleComponent extends React.Component {
  // 用于初始化 state
  constructor() {}
  // 用于替换 `componentWillReceiveProps` ，该函数会在初始化和 `update` 时被调用
  // 因为该函数是静态函数，所以取不到 `this`
  // 如果需要对比 `prevProps` 需要单独在 `state` 中维护
  static getDerivedStateFromProps(nextProps, prevState) {}
  // 判断是否需要更新组件，多用于组件性能优化
  shouldComponentUpdate(nextProps, nextState) {}
  // 组件挂载后调用
  // 可以在该函数中进行请求或者订阅
  componentDidMount() {}
  // 用于获得最新的 DOM 数据
  getSnapshotBeforeUpdate() {}
  // 组件即将销毁
  // 可以在此处移除订阅，定时器等等
  componentWillUnmount() {}
  // 组件销毁后调用
  componentDidUnMount() {}
  // 组件更新后调用
  componentDidUpdate() {}
  // 渲染组件函数
  render() {}
  // 以下函数不建议使用
  UNSAFE_componentWillMount() {}
  UNSAFE_componentWillUpdate(nextProps, nextState) {}
  UNSAFE_componentWillReceiveProps(nextProps) {}
}
```

## 列表 & Key

- key 帮助 React 识别哪些元素改变了，比如被添加或删除。因此你应当给数组中的每一个元素赋予一个确定的标识
- 一个元素的 key 最好是这个元素在列表中拥有的一个独一无二的字符串。通常，我们使用来自数据 id 来作为元素的 key
- 当元素没有确定 id 的时候，万不得已你可以使用元素索引 index 作为 key, React 默认使用索引用作为 key 值
- 数组元素中使用的 key 在其兄弟节点之间应该是独一无二的。然而，它们不需要是全局唯一的

## 协调(reconciliation)

- 设计动力
  - state 或 props 更新导致 render 函数返回不同的树，基于这两棵树之间的差别来判断如何有效率的更新 UI
  - 通用的解决方案：生成将一棵树转换成另一棵树的最小操作数（复杂度 O(n^3)）
  - React 提出的一套 O(n) 的启发式算法，两个假设的基础
    - 两个不同类型的元素会产生出不同的树
    - 开发者可以通过 key prop 来暗示哪些子元素在不同的渲染下能保持稳定
- Diffing 算法
  - 比对不同类型的元素，拆卸原有的树并且建立起新的树
  - 比对同一类型的 DOM 元素，会保留 DOM 节点，仅比对及更新有改变的属性
  - 比对同类型的组件元素，组件实例保持不变，state 保持一致，更新 props
  - 对子节点进行递归
    - 默认条件下，当递归 DOM 节点的子元素时，React 会同时遍历两个子元素的列表；当产生差异时，生成一个 mutation。末尾新增元素开销比较小，头部插入开销会比较大
    - 当子元素拥有 key 时，React 使用 key 来匹配原有树上的子元素以及最新树上的子元素
      - 在元素不进行重新排序时使用元素在数组中的下标作为 key 比较合适，但一旦有顺序修改，diff 就会变得慢。当基于下标的组件进行重新排序时，组件 state 可能会遇到一些问题。由于组件实例是基于它们的 key 来决定是否更新以及复用，如果 key 是一个下标，那么修改顺序时会修改当前的 key，导致非受控组件的 state（比如输入框）可能相互篡改导致无法预期的变动，一个[例子](https://codepen.io/pen?editors=0010)

## setState

- setState 是个异步 API, 其调用并不会马上引起 state 的改变,可以在第二个参数的回调函数值获取正确的 state

## Context

简述

> 将数据传递到整个组件树而不用手动每层写一遍 props

## 代码分割

简述

> 创建多个包并在运行时动态加载

要点

- 避免加载永远不需要的代码，并在初始加载的时候减少所需加载的代码量
- 通过 import() 语法,当 Webpack 解析到该语法时，会自动地开始进行代码分割
- React.lazy 接受一个函数，这个函数需要动态调用 import()。它必须返回一个 Promise，该 Promise 需要 resolve 一个 defalut export 的 React 组件
- Suspense 组件置于懒加载组件之上,fallback 属性接受任何在组件加载过程中你想展示的 React 元素
- 错误边界处理模块加载失败的情况
- React.lazy 目前只支持默认导出。可以创建一个中间模块，来将命名模块重新导出为默认模块。这能保证 tree shaking 不会出错，并且不必引入不需要的组件

示例

基于路由的代码分割

```js
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import React, { Suspense, lazy } from 'react'

const Home = lazy(() => import('./routes/Home'))
const About = lazy(() => import('./routes/About'))

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Suspense>
  </Router>
)
```

## Hook
