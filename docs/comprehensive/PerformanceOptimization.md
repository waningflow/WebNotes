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
