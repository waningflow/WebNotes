# 网络

## Cookie

简述

> 服务器发送到浏览器并保存在本地的数据，请求同一服务器时会被携带

要点

## Https

## XSS

简述

> 跨站脚本攻击

- 类型
  - 反射型 XSS
    - XSS 代码出现在 URL 中，诱导点击，提交给服务端。服务端返回的内容，也带上了这段 XSS 代码，最后浏览器执行 XSS 代码`http://xxx.com?x=<script>alert(document.cookie)</script>`
  - 存储型 XSS
    - 提交的 XSS 代码会存储在服务器端
  - DOM XSS
    - 不需要服务端参与，前端代码漏洞导致
- 防御手段
  - 过滤转义输入输出
  - 避免使用 eval，new Function 等执行字符串的方法，除非确定字符串和用户输入无关
  - 使用 innerHTML，document.write 的时候，如果数据是用户输入的，那么需要对关键字符都进行过滤与转义
  - 对于非客户端 cookie，比如保存用户凭证的 session，务必标识为 http only
  - 主动防御，当发现页面有 XSS 攻击时候，主动上报。对事件和脚本拦截。判断是否有恶意代码

## CSRF
