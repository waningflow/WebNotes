# 浏览器

## 事件机制

- 事件触发
  - window 往事件触发处传播，遇到注册的捕获事件会触发
  - 传播到事件触发处时触发注册的事件
  - 从事件触发处往 window 传播，遇到注册的冒泡事件会触发
- 如果给一个目标节点同时注册冒泡和捕获事件，事件触发会按照注册的顺序执行
- 注册事件，`addEventListener`
  - 第三个参数 useCapture 默认值为 false
  - stopPropagation 是用来阻止事件冒泡或捕获
  - stopImmediatePropagation 阻止事件，同时还能阻止该事件目标执行别的注册事件
- 事件代理，子节点的事件注册在父节点上

## 跨域

- 浏览器出于安全考虑，有同源策略。如果协议、域名或者端口有一个不同就是跨域，Ajax 请求会失败
- jsonp
  - 利用 `<script>` 标签没有跨域限制的漏洞。通过 `<script>` 标签指向一个需要访问的地址并提供一个回调函数来接收数据，
  - 使用简单且兼容性不错，但是只限于 get 请求
- cors
  - 服务端设置 Access-Control-Allow-Origin 就可以开启 CORS
  - 浏览器会自动进行 CORS 通信，IE 8 和 9 需要通过 XDomainRequest 来实现
- document.domain，只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。只需要给页面添加 document.domain = 'test.com' 表示二级域名都相同就可以实现跨域
- postMessage，通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息

示例

postMessage 使用

```js
// 发送消息端
window.parent.postMessage('message', 'http://test.com')
// 接收消息端
var mc = new MessageChannel()
mc.addEventListener('message', (event) => {
  var origin = event.origin || event.originalEvent.origin
  if (origin === 'http://test.com') {
    console.log('验证通过')
  }
})
```

## 存储

- cookie, (4K),一般由服务器生成，可以设置过期时间, 每次都会携带在 header 中，对于请求性能影响
  - value,如果用于保存用户登录态，应该将该值加密，不能使用明文的用户标识
  - http-only,不能通过 JS 访问 Cookie，减少 XSS 攻击
  - secure,只能在协议为 HTTPS 的请求中携带
  - same-site,规定浏览器不能在跨域请求中携带 Cookie，减少 CSRF 攻击
- localStorage, (5M),除非被清理，否则一直存在,
- sessionStorage, (5M), 页面关闭就清
- indexDB, (无限),除非被清理，否则一直存在
- Service Worker, 通常用来做缓存文件，提高首屏速度

## 渲染机制

- 渲染步骤
  - 处理 HTML 并构建 DOM 树。
  - 处理 CSS 构建 CSSOM 树。
    - 构建 CSSOM 树时，会阻塞渲染，直至 CSSOM 树构建完成。并且构建 CSSOM 树是一个十分消耗性能的过程，所以应该尽量保证层级扁平，减少过度层叠，越是具体的 CSS 选择器，执行速度越慢
  - 将 DOM 与 CSSOM 合并成一个渲染树。
  - 根据渲染树来布局，计算每个节点的位置。
  - 调用 GPU 绘制，合成图层，显示在屏幕上
- 当 HTML 解析到 script 标签时，会暂停构建 DOM，完成后才会从暂停的地方重新开始。也就是说，如果你想首屏渲染的越快，就越不应该在首屏就加载 JS 文件。并且 CSS 也会影响 JS 的执行，只有当解析完样式表才会执行 JS
- 一般来说，可以把普通文档流看成一个图层。特定的属性可以生成一个新的图层。不同的图层渲染互不影响，所以对于某些频繁需要渲染的建议单独生成一个新图层，提高性能。但也不能生成过多的图层，会引起反作用
  - 3D 变换：`translate3d`、`translateZ`
  - `will-change`
  - `video`、`iframe` 标签
  - 通过动画实现的 `opacity` 动画转换
  - `position: fixed`
- 回流必将引起重绘，重绘不一定会引起回流
  - 当渲染树中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为回流
  - 会导致回流的操作
    - 页面首次渲染
    - 浏览器窗口大小发生改变
    - 元素尺寸或位置发生改变
    - 元素内容变化（文字数量或图片大小等等）
    - 元素字体大小变化
    - 添加或者删除可见的 DOM 元素
    - 激活 CSS 伪类（例如：:hover）
    - 查询某些属性或调用某些方法
  - 一些常用且会导致回流的属性和方法
    - clientWidth、clientHeight、clientTop、clientLeft
    - offsetWidth、offsetHeight、offsetTop、offsetLeft
    - scrollWidth、scrollHeight、scrollTop、scrollLeft
    - scrollIntoView()、scrollIntoViewIfNeeded()
    - getComputedStyle()
    - getBoundingClientRect()
    - scrollTo()
  - 当页面中元素样式的改变并不影响它在文档流中的位置时（例如：color、background-color、visibility 等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘
  - 如何避免
    - CSS
      - 避免使用 table 布局。
      - 尽可能在 DOM 树的最末端改变 class。
      - 避免设置多层内联样式。
      - 将动画效果应用到 position 属性为 absolute 或 fixed 的元素上。
      - 避免使用 CSS 表达式（例如：calc()）
    - JS
      - 避免频繁操作样式，最好一次性重写 style 属性，或者将样式列表定义为 class 并一次性更改 class 属性。
      - 避免频繁操作 DOM，创建一个 documentFragment，在它上面应用所有 DOM 操作，最后再把它添加到文档中。
      - 也可以先为元素设置 display: none，操作结束后再把它显示出来。因为在 display 属性为 none 的元素上进行的 DOM 操作不会引发回流和重绘。
      - 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
      - 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流。

## 缓存

- 缓存位置
  - Service Worker
    - 传输协议必须为 HTTPS
    - 自由控制缓存，如何匹配缓存，如何读取缓存，并且是持续性的
  - Memory Cache
    - 读取高效，缓存时间短
    - 不关心返回资源的 HTTP 缓存头 Cache-Control 是什么值，同时资源的匹配也并非仅仅是对 URL 做匹配，还可能会对 Content-Type，CORS 等其他特征做校验
  - Disk Cache
    - 读取速度漫，容量和存储时效性好
    - 根据 HTTP Herder 中的字段判断哪些资源需要缓存，哪些资源可以不请求直接使用，哪些资源已经过期需要重新请求
  - Push Cache
    - HTTP/2
- 强缓存。不会向服务器发送请求，直接从缓存中读取资源，返回 200 的状态码，并且 Size 显示 from disk cache 或 from memory cache
  - Expires（HTTP/1）
    - 指定资源到期的时间
    - 修改了本地时间，可能会造成缓存失效
  - Cache-Control（HTTP/1.1）
    - 多种指令组合
    - 优先级高于 Expries
- 协商缓存。强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程
  - Last-Modified/If-Modified-Since，文件最后修改时间
    - 只能以秒计时
  - ETag/If-None-Match，资源文件的一个唯一标识(由服务器生成)
    - 精度优于 Last-Modified，性能逊于 Last-Modified，优先级高于 Last-Modified
- 缓存机制
  - 强缓存优先于协商缓存进行
  - 协商缓存生效，返回 304，继续使用缓存
  - 协商缓存失效，返回 200，重新返回资源和缓存标识
- 实际场景
  - 频繁变动的资源，`Cache-Control: no-cache`，使浏览器每次都请求服务器，然后配合 ETag 或者 Last-Modified 来验证资源是否有效
  - 不常变化的资源，`Cache-Control: max-age=31536000`，使用强缓存一年，在文件名(或者路径)中添加 hash、版本号等动态字符来更更改引用 URL
- 用户行为对浏览器缓存的影响
  - 打开网页，地址栏输入地址： 查找 disk cache 中是否有匹配。如有则使用；如没有则发送网络请求
  - 普通刷新：因为 TAB 并没有关闭，因此 memory cache 是可用的，会被优先使用(如果匹配的话)。其次才是 disk cache
  - 强制刷新：浏览器不使用缓存，因此发送的请求头部均带有 Cache-control: no-cache(为了兼容，还带了 Pragma: no-cache),服务器直接返回 200 和最新内容

## Web Components

> 创建可重用的定制元素

- 四项主要技术
  - Custom elements（自定义元素）：一组 JavaScript API，允许您定义 custom elements 及其行为，然后可以在您的用户界面中按照需要使用它们。
  - Shadow DOM（影子 DOM）：一组 JavaScript API，用于将封装的“影子”DOM 树附加到元素（与主文档 DOM 分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。
  - HTML templates（HTML 模板）：`<template>` 和 `<slot>` 元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。
  - HTML Imports（HTML 导入）：一旦定义了自定义组件，最简单的重用它的方法就是使其定义细节保存在一个单独的文件中，然后使用导入机制将其导入到想要实际使用它的页面中。HTML 导入就是这样一种机制，尽管存在争议 — Mozilla 根本不同意这种方法，并打算在将来实现更合适的

## ArrayBuffer, binary arrays

> 二进制数据操作相关概念

- ArrayBuffer
- Unit8Array
- DataView
- Blob
- File

## SharedArrayBuffer

## performance

## API

- `document​.create​Document​Fragment()`, 创建一个新的空白的文档片段

## 零碎

- script 标签的 defer 和 async 属性
  - 不加属性 -> 加载并执行 js 后再继续 dom 树构建
  - 加 async -> 异步加载 js，但加载后会立即执行并阻塞 dom 树构建
  - 加 defer -> 异步加载 js，等 dom 树构建完毕再执行 js
