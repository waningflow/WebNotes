# 性能优化

## 网络相关

- DNS 预读取
  - 使浏览器主动去执行域名解析的功能，其范围包括文档的所有链接，减少用户点击链接时的延迟
  - 打开和关闭 DNS 预读取
    - 在服务器端发送 X-DNS-Prefetch-Control 报头
    - 文档中使用值为 `http-equiv` 的 `<meta>` 标签`<meta http-equiv="x-dns-prefetch-control" content="off">`
  - 强制查询特定主机名
    - 通过使用 `rel` 属性值为 `dns-prefetch` 的 `<link>` 标签来对特定域名进行预读取(即使主页上没有该链接),`<link rel="dns-prefetch" href="http://www.spreadfirefox.com/">`
- 强缓存,在缓存期间不需要请求，state code 为 200。可以通过两种响应头实现：
  - Expires(HTTP / 1.0 )，资源过期时间，
  - Cache-Control(HTTP / 1.1), 优先级高于 Expires
- 协商缓存，发出请求，如果缓存有效会返回 304。两种实现方式
  - Last-Modified 和 If-Modified-Since
  - ETag 和 If-None-Match(fb api 采用)
    - ETag 类似于文件指纹，If-None-Match 将当前 ETag 发送给服务器，询问该资源 ETag 是否变动，有变动的话就将新的资源发送回来。并且 ETag 优先级比 Last-Modified 高
- 选择合适的缓存策略
  - 对于某些不需要缓存的资源，可以使用 `Cache-control: no-store`
  - 对于频繁变动的资源，可以使用 `Cache-Control: no-cache` 并配合 `ETag` 使用，表示该资源已被缓存，但是每次都会发送请求询问资源是否更新
  - 对于代码文件来说，通常使用 Cache-Control: max-age=31536000 并配合策略缓存使用，然后对文件进行指纹处理，一旦文件名变动就会立刻下载新的文件
- 使用 HTTP / 2.0
  - 引入了多路复用，能够让多个请求使用同一个 TCP 链接，加快网页加载速度
  - Header 压缩，减少了请求的数据大小
- 预加载，不需要马上用到的资源，但是希望尽早获取
  - 不会阻塞 onload 事件
- 预渲染，将下载的文件预先在后台渲染

## 渲染过程

- 懒执行，将某些逻辑延迟到使用时再计算
- 懒加载，将不关键的资源延后加载

## 文件优化

- 图片优化
  - 图片压缩
  - 尽量用 CSS 替换
  - 移动端请求剪裁后的图片
  - 小图使用 base64 格式
  - 雪碧图
  - 选择正确的图片格式
    - 尽量用 WebP 格式（具有更好的图像数据压缩算法，能带来更小的图片体积，而且拥有肉眼识别无差异的图像质量，缺点就是兼容性并不好）
    - 小图使用 PNG 或者 SVG
    - 照片使用 JPEG
- 其他文件优化
  - CSS 文件放在 head 中（避免 CSSOM 创建滞后于 DOM 导致回流以及“裸奔”）
  - 服务端开启文件压缩功能
  - script 标签放在 body 底部
  - 对于需要很多时间计算的代码可以考虑使用 Webworker
- CDN
  - 静态资源尽量使用 CDN 加载
  - 由于浏览器对于单个域名有并发请求上限，可以考虑使用多个 CDN 域名
  - 对于 CDN 加载静态资源需要注意 CDN 域名要与主站不同，否则每次请求都会带上主站的 Cookie

## Webpack 优化

- 对于 Webpack4，打包项目使用 production 模式，这样会自动开启代码压缩
- 使用 ES6 模块来开启 tree shaking，这个技术可以移除没有使用的代码
- 优化图片，对于小图可以使用 base64 的方式写入文件中
- 按照路由拆分代码，实现按需加载
- 给打包出来的文件名添加哈希，实现浏览器缓存文件，[文档](https://webpack.docschina.org/guides/caching/)

## 性能优化清单

- 计划和度量
  - 树立性能优化意识
  - 目标：至少要比你最快的竞争对手还快 20%
  - 选择正确的度量
    - 首次有效渲染（FMP，是指主要内容出现在页面上所需的时间）
    - 重要渲染时间（页面最重要部分渲染完成所需的时间），
    - 可交互时间（TTI，是指页面布局已经稳定，关键的页面字体已经可见，主进程可以足够的处理用户的输入 —— 基本的时间标记是，用户可以在 UI 上进行点击和交互），
    - 输入响应，接口响应用户操作所需的时间，
    - Speed Index，测量填充页面内容的速度。 分数越低越好，
    - 自定义度量
  - 从具有代表性的用户使用的设备收集数据
    - 被动监测工具，可以根据请求来模拟用户交互（综合测试，如 Lighthouse，WebPageTest）
    - 主动监测工具， 是那些不断记录和评价用户交互行为的（真正的用户监控，如 SpeedCurve，New Relic —— 这两种工具也提供综合测试）
  - 与你的同事分享性能清单
- 制定现实的目标
  - 控制响应时间在 100ms 内，控制帧速在 60 帧/秒
  - SpeedIndex < 1250, TTI < 5s on 3G, Critical file size budget < 170Kb
- 定义环境
  - 做好构建工具的选型以及搭建好（适合自己的）构建工具
  - 渐进式增强
  - 选择一个强大的性能基准
    - PRPL 模式，保持推送关键资源，渲染初始路由，预缓存剩余路由和延迟加载必要的剩余路由
  - 你的项目需要使用 AMP 和 Instant Articles 么？
  - 合理使用 CDN
- 构建优化
  - 分清轻重缓急
  - 考虑使用“cutting-the-mustard”模式
  - 减少解析 JavaScript 的成本
  - 你使用 ahead-of-time 编译器么？
  - 你使用 tree-shaking、scope hoisting、code-splitting 么
  - 利用你使用的 JavaScript 引擎对其进行优化
  - 客户端渲染还是服务端渲染？
  - 你是否限制第三方脚本的影响？
  - HTTP cache 头部设置是否合理？
- 静态资源优化
  - 你是否使用 Brotli 或 Zopfli 进行纯文本压缩？
  - 图像是否进行了适当的优化？
  - 是否对 Web 字体进行了优化？
- 交付优化
  - 你是否异步加载 JavaScript？
  - 你对开销很大的 JS 是否使用懒加载并使用 Intersection Observer？
  - 你是否优先加载关键的 CSS？
  - 你使用流响应吗?
  - 你使用 Save-Data 存储数据吗?
  - 你是否激活了连接以加快传输
  - 你优化渲染性能了吗？
  - 你优化过渲染体验吗？
- HTTP/2
  - 迁移到 HTTPS，然后打开 HTTP/2.
  - 正确地部署 HTTP/2.
  - 你的服务和 CDNs 支持 HTTP/2 吗？
  - 是否启动了 OCSP stapling？
  - 你是否已采用了 IPv6？
  - 你使用（针对 HTTP 响应头压缩的）HPACK 压缩算法了吗？
  - 务必保证服务器的安全性
  - 是否使用了 service workers 来缓存以及用作网络回退？
- 测试和监控
  - 你是了解否在代理浏览器和旧版浏览器中测试过？
  - 是否启用了持续监控？
- 速效方案
  - 测量实际环境的体验并设定适当的目标。一个好的目标是：第一次有意义的绘制 < 1 s，速度指数 < 1250，在慢速的 3G 网络上的交互 < 5s，对于重复访问，TTI < 2s。优化渲染开始时间和交互时间。
  - 为您的主模板准备关键的 CSS，并将其包含在页面的 `<head>` 中。（你的预算是 14 KB）。对于 CSS/JS，文件大小不超过 170 KB gzipped（解压后 0.8-1 MB）。
  - 延迟加载尽可能多的脚本，包括您自己的和第三方的脚本——特别是社交媒体按钮、视频播放器和耗时的 JavaScript 脚本。
  - 添加资源提示，使用 dns-lookup、preconnect、prefetch 和 preload 加速传输。
  - 分离 web 字体，并以异步方式加载它们（或切换到系统字体）。
  - 优化图像，并在重要页面（例如登录页面）中考虑使用 WebP。
  - 检查 HTTP 缓存头和安全头是否设置正确。
  - 在服务器上启用 Brotli 或 Zopfli 压缩。（如果做不到，不要忘记启用 Gzip 压缩。）
  - 如果 HTTP/2 可用，启用 HPACK 压缩并开启混合内容警告监控。如果您正在运行 LTS，也可以启用 OCSP stapling。
  - 在 service worker 缓存中尽可能多的缓存资产，如字体、样式、JavaScript 和图像。

## JavaScript 启动优化

## 监控方式

- lighthouse
- webpackBundleAnalyzer
- CSS 和 JS 代码覆盖率

## 性能分析

- [Chrome Developer Tools](https://developers.google.com/web/tools/chrome-devtools)
  - Performance
