# "非" web

## Hybrid

- 最大的需求点：一套完整又强大的 Hybrid 技术架构方案
  - 既能利用 H5 强大的开发和迭代能力，又能赋予 H5 强大的底层能力和用户体验，同时能复用现有的成熟 Native 组件
- 几种混合方案，主要是在 UI 渲染机制上的不同
  - 基于 WebView UI。例如微信 JS-SDK，通过 JSBridge 完成 H5 与 Native 的双向通讯，从而赋予 H5 一定程度的原生能力
  - 基于 Native UI。例如 React-Native、Weex，将 js 解析成的虚拟节点树(Virtual DOM)传递到 Native 并使用原生渲染
  - 小程序。通过更加定制化的 JSBridge，并使用双 WebView 双线程的模式隔离了 JS 逻辑与 UI 渲染，形成了特殊的开发模式，加强了 H5 与 Native 混合程度，提高了页面性能及开发体验
- 技术原理
  - JS call native
    - WebView URL Scheme 跳转拦截
  - native call JS
    - 通过 WebView API 直接执行 Js 代码
  - JSBridge 的接入
    - 封装一个 Native SDK，由客户端统一引入。客户端在初始化一个 WebView 打开页面时，如果页面地址在白名单中，会直接在 HTML 的头部注入对应的 bridge.js
      - JS 部分(bridge): 在 JS 环境中注入 bridge 的实现代码，包含了协议的拼装/发送/参数池/回调池等一些基础功能
      - Native 部分(SDK)：在客户端中 bridge 的功能映射代码，实现了 URL 拦截与解析/环境信息的注入/通用功能映射等功能
  - App 中 H5 的接入方式
    - 在线 H5
    - 内置包 H5

## 小程序

## electron

## react native
