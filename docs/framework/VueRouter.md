# VueRouter

## 源码实现

要点

- 路由注册，调用 Vue.use(VueRouter)，运行 install 函数，给组件混入钩子函数并且全局注册两个路由组件
- 实例化, 创建一个路由匹配对象，并且根据 mode 来采取不同的路由方式
- 创建路由匹配对象，通过用户配置的路由规则来创建路由映射表
- 路由初始化(进行路由的跳转，改变 URL 然后渲染对应的组件)
- 路由跳转(获取匹配的路由信息 -> 匹配路由 -> 执行跳转)

## 导航守卫