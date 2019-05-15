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
  - Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。
  - Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替

### nextTick

要点

- 在下次 DOM 更新循环结束之后执行延迟回调,在修改数据之后立即使用这个方法，获取更新后的 DOM
- 2.1.0 起新增：如果没有提供回调且在支持 Promise 的环境中，则返回一个 Promise

### 生命周期

- 所有的生命周期钩子自动绑定 this 上下文到实例,不能使用箭头函数来定义一个生命周期方法
- 生命周期钩子
  - beforeCreate, 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用
  - created, 在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，\$el 属性目前不可见
  - beforeMount, 在挂载开始之前被调用：相关的 render 函数首次被调用
  - mounted, el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用 (mounted 不会承诺所有的子组件也都一起被挂载，如果希望等到整个视图都渲染完毕，可以用 vm.$nextTick)
  - beforeUpdate，数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器
  - updated，组件 DOM 已经更新（updated 不会承诺所有的子组件也都一起被重绘， 同样可以用 vm.\$nextTick）
  - activated，keep-alive 组件激活时调用
  - deactivated，keep-alive 组件停用时调用
  - beforeDestroy，实例销毁之前调用。在这一步，实例仍然完全可用
  - destroyed，Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁
  - errorCaptured，当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播

### 异步组件

### API

要点

- `Vue.use( plugin )`，安装 Vue.js 插件。如果插件是一个对象，必须提供 install 方法。如果插件是一个函数，它会被作为 install 方法。install 方法调用时，会将 Vue 作为参数传入。该方法需要在调用 new Vue() 之前被调用。当 install 方法被同一个插件多次调用，插件将只会被安装一次
- `Vue.mixin( mixin )`，全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。插件作者可以使用混入，向组件注入自定义的行为。
