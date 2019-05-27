# NPM

## npm install

- 安装过程
  - 发出 npm install 命令
  - npm 向 registry 查询模块压缩包的网址
  - 下载压缩包，存放在~/.npm 目录
  - 解压压缩包到当前项目的 node_modules 目录

## npm link

要点

- 在一个模块的根目录运行`npm link`, 会创建一个从`<global_node_modules>/<module_name>`到本地模块的符号链接
- 在一个项目里运行`npm link <module_name>`, 会创建一个从`./node_modules/<module_name>`到`<global_node_modules>/<module_name>`的符号链接

## npm root

要点

- `npm root -g`获取 global node_modules 路径

## Dependency

- dependencies，代码运行时需要的依赖
- devDependencies，开发时需要，运行时不再需要的依赖
- peerDependencies，“同伴依赖”，一种特殊的依赖，在发布包的时候需要。意味着安装包的用户也需要和包同样的依赖
- optionalDependencies，可选依赖
- bundledDependencies，“打包依赖”，在项目内部使用，基本上和普通依赖相同
  - 普通依赖通常从 npm registry 安装，这些情况下，打包依赖比普通依赖更好用
    - 当你想使用一个不在 npm registry 里的，或者被修改过的第三方库时
    - 当你想把自己的项目作为模块来重用时
    - 当你想和你的模块一起发布一些文件时

## npx

- 主要解决调用项目内部安装的模块的问题
