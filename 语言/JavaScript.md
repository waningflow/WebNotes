引用 YDKJS 一段话

> JavaScript is awesome. It's easy to learn partially, and much harder to learn completely (or even sufficiently).

### 类型

要点

- `string`,`number`,`boolean`,`null`,`undefined`,`object`,`symbol`(ES6 新增)
- `typeof null === "object"`,历史遗留 bug
- `typeof [] === "object"`,数组是特殊的对象 ,`typeof function(){} === "function"`，函数是对象的子类型
- 对于直接执行在`string`上的方法，js 实际是创建了一个对应的`String`对象,并执行`String.prototype`上的方法，如`"hello".toUpperCase()`。`number`和`boolean`同理
- 强制转换，显性`Number("42")`，隐性`"42" * 1`
- Truthy & Falsy,一个非`boolean`转变为`boolean`会变成`true/false`
  - Falsy: `""`,`0`,`-0`,`NaN`,`null`,`undefined`,`false`
  - Trythy: 除了 Falsy 的其他都是
- 相等和不等
  - `==`,允许强制转换
  - `===`,不允许强制转换
  - 其他不等符号如`>`，允许强制转换


### 箭头函数

简述

> 更简短的函数;不绑定 this

要点

- 更短的函数
  - 不解释
- 不绑定 this
  - 不会创建自己的 this,只会从自己的作用域链的上一层继承 this
  - 使用 call(), apply(), bind()方法时，只能传递参数, 不能绑定 this, 他们的第一个参数会被忽略
  - 不绑定 Arguments 对象
  - 不能用作构造器，和 new 一起用会抛出错误
  - 没有 prototype 属性

示例

```

```

疑问

> 鉴于 this 是词法层面上的，严格模式中与 this 相关的规则都将被忽略

### 关于 this

简述

> 因为函数可以在不同的运行环境执行，所以需要"this"在函数体内部，指代函数当前的运行环境

要点

- this 的指向取决于函数的调用位置

示例

```js
const a = {
  a: 'a'
}
const obj = {
  getThis: () => this,
  getThis2() {
    return this
  }
}
obj.getThis3 = obj.getThis.bind(obj)
obj.getThis4 = obj.getThis2.bind(obj)
const answers = [
  obj.getThis(),
  obj.getThis.call(a),
  obj.getThis2(),
  obj.getThis2.call(a),
  obj.getThis3(),
  obj.getThis3.call(a),
  obj.getThis4(),
  obj.getThis4.call(a)
]

// undefined,undefined,obj,a,undefined,undefined,obj,obj
```

```js
const a = {
  a: 'a'
}
class Obj {
  getThis = () => this
  getThis2() {
    return this
  }
}
const obj2 = new Obj()
obj2.getThis3 = obj2.getThis.bind(obj2)
obj2.getThis4 = obj2.getThis2.bind(obj2)
const answers2 = [
  obj2.getThis(),
  obj2.getThis.call(a),
  obj2.getThis2(),
  obj2.getThis2.call(a),
  obj2.getThis3(),
  obj2.getThis3.call(a),
  obj2.getThis4(),
  obj2.getThis4.call(a)
]

// obj2,obj2,obj2,a,obj2,obj2,obj2,obj2
```

### new 操作符

### call 函数

### apply 函数

### bind 函数

### promise

### async

### 严格模式

### 原型

简述

> 继承机制的基础

要点

- C.prototype 用于建立由 new C()创建的对象的原型
- Object.getPrototypeOf(obj)是获取 obj 对象的原型对象的标准方法
- obj.\_\_proto\_\_是获取 obj 对象的原型对象的非标准方法
- 使用 Object.getPrototypeOf()而不要使用\_\_proto\_\_属性
  - 后者在某些情况下表现不可预测，而前者都是有效的，比如对于拥有 null 原型的对象
  - 后者会污染所有的对象，导致大量 bug
- 始终不要修改\_\_proto\_\_
  - 可移植性问题，不是所有平台都支持修改对象原型
  - 性能问题，导致浏览器基于对象结构的优化失效
  - 行为无法预测
- 使用 Object.create 给新对象设置原型

示例

通过构造函数的原型实现继承

```js
function Person() {}
Person.prototype.walk = function() {
  return 'walking ...'
}

function Worker() {}
Worker.prototype = Object.create(Person.prototype)

Worker.prototype.work = function() {
  return 'working ....'
}

function Developer() {}
Developer.prototype = Object.create(Worker.prototype)
Developer.prototype.code = function() {
  return 'coding ....'
}

var dev = new Developer()
dev.code() // 'coding ...'
dev.work() // 'working ...'
dev.walk() // 'walking ...'
```

直接连接各个对象也可以实现继承，但是只有一个实例

```js
var person = {
  walk() {
    return 'walking...'
  }
}

var worker = Object.create(person)
worker.work = function() {
  return 'working'
}

var dev = Object.create(worker)
dev.code = function() {
  return 'coding...'
}
dev.code() // 'coding ...'
dev.work() // 'working ...'
dev.walk() // 'walking ...'
```

使用 function mixin

```js
/* Define Person's functionalities */
function personFns() {
  this.walk = function() {
    return 'Walking ...'
  }
  this.getName = function() {
    return this.name
  }
}

/* Define Worker's functionalities */
function workerFns() {
  this.work = function() {
    return 'Working ...'
  }
}

/* Define Developer's functionalities */
function developerFns() {
  this.code = function() {
    return 'Coding ...'
  }
}

/* Define the Developer type */
function Developer(name) {
  if (!(this instanceof Developer)) {
    return new Developer(name)
  }
  this.name = name
  this.toString = function() {
    return this.name
  }
}

/* apply each functionalities to
Developer's prototype */
;[personFns, workerFns, developerFns].forEach(fn => {
  fn.call(Developer.prototype)
})

/* create an instance and call methods */
const dev = Developer('AJ')
console.log(dev.getName()) //AJ
console.log(dev.walk()) //Walking ...
console.log(dev.work()) //Working ...
console.log(dev.code()) //Coding ...
console.log('Dev is: ' + dev) //Dev is: AJ
```

class 本质

```js
class Car {
  constructor(name) {
    this.name = name
  }
  move() {
    return 'moving...'
  }
}

const toyota = new Car('Toyota')
toyota.move()

// 等同于下面的代码

function Car(name) {
  this.name = name
}
Car.prototype.move = function move() {
  return 'moving...'
}

const toyota = new Car('Toyota')
toyota.move()
```

### Object.defineProperty()
