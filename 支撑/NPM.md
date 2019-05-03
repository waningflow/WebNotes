### npm link

要点
- 在一个模块的根目录运行`npm link`, 会创建一个从`<global_node_modules>/<module_name>`到本地模块的符号链接
- 在一个项目里运行`npm link <module_name>`, 会创建一个从`./node_modules/<module_name>`到`<global_node_modules>/<module_name>`的符号链接

### npm root

要点
- `npm root -g`获取global node_modules路径
