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
mc.addEventListener('message', event => {
  var origin = event.origin || event.originalEvent.origin
  if (origin === 'http://test.com') {
    console.log('验证通过')
  }
})
```
