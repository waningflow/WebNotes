# Flux

简述

> 一种架构思想，专门解决软件的结构问题

要点

- 四个部分
  - View： 视图层
  - Action（动作）：视图层发出的消息（比如 mouseClick）
  - Dispatcher（派发器）：用来接收 Actions、执行回调函数
  - Store（数据层）：用来存放应用的状态，一旦发生变动，就提醒 Views 要更新页面
- 数据的"单向流动"
