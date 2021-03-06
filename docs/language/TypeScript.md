# TypeScript

简述

> - JavaScript 超集，可被编译成 JavaScript
> - 支持类型系统
> - 支持 ES6

## 基础类型

- 布尔值
- 数字
- 字符串
- 数组
- 元组 Tuple
- 枚举
- Any
- Void
- null 和 undefined
- Never
- Object
- 类型断言

## 接口

- 可选属性
- 只读属性
- 额外属性检查
- 函数类型

```js
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

- 可索引的类型

```js
interface StringArray {
  [index: number]: string;
}
```

- 类类型
- 继承接口
- 混合类型
- 接口继承类

## 类

- 公共，私有与受保护的修饰符
  - 默认为`public`
  - `private`和`protected`
    - 不能在声明它的类的外部访问
    - 当比较带有 private 或 protected 成员的类型的时候，如果其中一个类型里包含一个 private 成员，那么只有当另外一个类型中也存在这样一个 private 成员， 并且它们都是来自同一处声明时，这两个类型才是兼容的。 对于 protected 成员也使用这个规则
    - protected 修饰符与 private 修饰符的行为很相似，但有一点不同， protected 成员在派生类中仍然可以访问
- readonly 修饰符
  - 只读属性必须在声明时或构造函数里被初始化
- 参数属性
  - 通过给构造函数参数前面添加一个访问限定符来声明

```js
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    }
}
```

- 存取器
- 静态属性
- 抽象类

## 函数

- 完整函数类型

```js
let myAdd: (baseValue: number, increment: number) => number = function(x: number, y: number): number {
  return x + y
}
```

- 推断类型

```js
// myAdd has the full function type
let myAdd = function(x: number, y: number): number {
  return x + y
}

// The parameters `x` and `y` have the type number
let myAdd: (baseValue: number, increment: number) => number = function(x, y) {
  return x + y
}
```

- 可选参数和默认参数
  - 可选参数必须跟在必须参数后面
  - 在所有必须参数后面的带默认初始化的参数都是可选的
  - 带默认值的参数不需要放在必须参数的后面，如果带默认值的参数出现在必须参数前面，用户必须明确的传入 undefined 值来获得默认值
- 重载

## 泛型

- 泛型类型
- 泛型类
- 泛型约束

## 枚举

- 数字枚举
- 字符串枚举
- 异构枚举
- 计算的和常量成员
- 联合枚举与枚举成员的类型
- 运行时的枚举
- 外部枚举

## 高级类型

- 交叉类型
- 联合类型
- 类型保护与区分类型
- 可以为 null 的类型
- 类型别名
- 字符串字面量类型
- 数字字面量类型
- 枚举成员类型
- 可辨识联合
- 多态的 this 类型
- 索引类型
- 映射类型

## 装饰器

- 装饰器工厂
- 装饰器组合
- 装饰器求值
- 类装饰器
- 方法装饰器
- 访问器装饰器
- 属性装饰器
- 参数装饰器
- 元数据
