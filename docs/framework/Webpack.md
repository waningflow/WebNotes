# Webpack

## loader

- 所有资源都是 JS，webpack 只支持 JS 模块，所有其他类型的模块，比如图片，css 等，都需要通过对应的 loader 转成 JS 模块
  - 对于 CSS，我们可以把它转成一段 JS，这个 JS 会把 CSS 插入到 DOM 中
  - 对于图片，我们可以把它进行 base64 转换变成一个字符串，或者进行文件拷贝然后导出它的 URL
- 所有的 loader 都是一个管道, 进口是 一个字符串，然后经过加工，输出另一个字符串
  - 单一职责，每个 loader 只负责处理一个单一的任务
  - 通过组合不同的 loader 实现强大的功能

## 编写一个 loader

简述

> loader 是导出为一个函数的 node 模块。该函数在 loader 转换资源的时候调用。给定的函数将调用 loader API，并通过 this 上下文访问

要点

- 当链式调用多个 loader 的时候会以相反的顺序执行
  - 最后的 loader 最早调用，将会传入原始资源内容
  - 第一个 loader 最后调用，期望值是传出 JavaScript 和 source map（可选）
  - 中间的 loader 执行时，会传入前一个 loader 传出的结果
- 用法准则
  - 简单易用。单一任务
  - 使用链式传递。意味着不一定要输出 JavaScript。只要下一个 loader 可以处理这个输出，这个 loader 就可以返回任意类型的模块
  - 模块化的输出
  - 确保无状态。在不同模块转换之间不保存状态。每次运行都应该独立于其他编译模块以及相同模块之前的编译结果
  - 使用 loader utilities。获取传递给 loader 的选项。schema-utils 包配合 loader-utils，用于保证 loader 选项，进行与 JSON Schema 结构一致的校验
  - 记录 loader 的依赖。使用外部资源（例如，从文件系统读取），必须声明它（使用 addDependency 方法）
  - 解析模块依赖关系
  - 提取通用代码。避免在 loader 处理的每个模块中生成通用代码。相反，你应该在 loader 中创建一个运行时文件，并生成 require 语句以引用该共享模块
  - 避免绝对路径。不要在模块代码中插入绝对路径，因为当项目根路径变化时，文件绝对路径也会变化。loader-utils 中的 stringifyRequest 方法，可以将绝对路径转化为相对路径
  - 使用 peer dependencies。如果你的 loader 简单包裹另外一个包，你应该把这个包作为一个 peerDependency 引入

## 插件

简述

> 解决 loader 无法实现的其他事

## 编写一个插件

## 代码分离

简述

> 把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件

要点

- 三种方法
  - 入口起点：使用 entry 配置手动地分离代码
  - 防止重复：使用 SplitChunksPlugin 去重和分离 chunk
  - 动态导入：通过模块中的内联函数调用来分离代码
    - import() 语法
- 预取/预加载模块
  - prefetch(预取)：将来某些导航下可能需要的资源
  - preload(预加载)：当前导航下可能需要资源
- bundle 分析，[webpack-chart](https://alexkuz.github.io/webpack-chart/),[webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/),[webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer),[webpack bundle optimize helper](https://webpack.jakoblind.no/optimize)
