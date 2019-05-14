### 响应式原理

要点

- 追踪变化
  - 遍历 data 对象所有属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter
  - 每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据属性记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染
- 检测变化
  - Vue 无法检测到对象属性的添加或删除,属性必须在 data 对象上存在才能让 Vue 将它转换为响应式的
  - 通过`vm.$set`方法向嵌套对象添加响应式属性
  - 通过`Object.assign()`创建一个新对象
- 异步更新队列
  - Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替

### nextTick

要点

- 在下次 DOM 更新循环结束之后执行延迟回调,在修改数据之后立即使用这个方法，获取更新后的 DOM
- 2.1.0 起新增：如果没有提供回调且在支持 Promise 的环境中，则返回一个 Promise

### 生命周期

### 异步组件
