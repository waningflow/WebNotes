# 框架

## MVVM

要点

- View：界面，Model：数据模型，ViewModel：沟通 View 和 Model
- 脏数据检测`$digest`循环遍历所有的数据观察者,若发现变化，会调用`$watch`，然后再次调用 `$digest` 循环直到发现没有变化
- 数据劫持
  - 通过`Object.defineProperty()`监听 `set` 和 `get`
  - 手动触发一次属性的 getter 来实现发布订阅的添加
- `Object.defineProperty`缺点，（ 用 Proxy 替换 ）
  - 只能对属性进行数据劫持，所以需要深度遍历整个对象
  - 对于数组不能监听到数据的变化

## 路由

要点

- 监听 URL 变化，匹配路由规则，显示相应页面
- hash 模式和 history 模式

## Virtual Dom

要点

- Virtual Dom 算法
  - 通过 JS 来模拟创建 DOM 对象
  - 判断两个对象的差异
  - 渲染差异
- diff 算法，（只对比同层的节点，O(n) 复杂度）
  - 首先从上至下，从左往右遍历对象，也就是树的深度遍历，这一步中会给每个节点添加索引，便于最后渲染差异
  - 一旦节点有子元素，就去判断子元素是否有不同
- 判断列表差异算法
  - 遍历旧的节点列表，查看每个节点是否还存在于新的节点列表中
  - 遍历新的节点列表，判断是否有新的节点，同时判断节点是否有移动