# Webpack

## loader

- 所有资源都是 JS，webpack 只支持 JS 模块，所有其他类型的模块，比如图片，css 等，都需要通过对应的 loader 转成 JS 模块
  - 对于 CSS，我们可以把它转成一段 JS，这个 JS 会把 CSS 插入到 DOM 中
  - 对于图片，我们可以把它进行 base64 转换变成一个字符串，或者进行文件拷贝然后导出它的 URL
- 所有的 loader 都是一个管道, 进口是 一个字符串，然后经过加工，输出另一个字符串
  - 单一职责，每个 loader 只负责处理一个单一的任务
  - 通过组合不同的 loader 实现强大的功能

## 插件

简述

> 解决 loader 无法实现的其他事

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
