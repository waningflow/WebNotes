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
  - Truthy: 除了 Falsy 的其他都是
- 相等和不等
  - `==`,允许强制转换
  - `===`,不允许强制转换
  - 其他不等符号如`>`，允许强制转换

### 变量

要点

- var 声明的变量在作用域内自动提升
- 访问作用域内不存在的变量会报`ReferenceError`, 给未声明的变量赋值在非严格模式下会在全局作用域创建一个变量，而在严格模式下会报`ReferenceError`
- let 声明的变量在一个 block(`{}`)内有效，在 block 内 let 声明之前称为`TDZ`(暂时性死区)，此时访问变量会报`ReferenceError`

### 编译原理

要点

- 简单说分为三个主要环节，实际会复杂很多
  - Tokenizing/Lexing, 分词,词法分析
  - Parsing，转换成“AST”(Abstract Syntax Tree)
  - Code-Generation，生成可执行代码
- 术语
  - LHS（Left-hand Side），赋值的目标, 如果 LHS look-up 直到最顶层作用域也没有找到一个变量，在非严格模式，会创建一个变量，而在严格模式会抛出`ReferenceError`错误
  - RHS（Right-hand Side），赋值的源，如果 RHS look-up 在所有嵌套作用域中没有找到一个变量，则会抛出`ReferenceError`错误。如果对找到的变量做错误的操作，比如试图像函数一样执行一个`非函数`,则会抛出`TypeError`
- 对于一个表达式`var a = 2`, JS 引擎看到的是两个表达式`var a`和`a = 2`, 前者在编译阶段将`a`加到作用域，后者在运行阶段执行

### 对象



### 作用域

简述

> 存取变量的规则

要点

- 两种主要作用域模式，`Lexical Scope(词法作用域)`和`Dynamic Scope(动态作用域)`,JS 采用的词法作用域
- 词法作用域在编译的词法分析时就已确定（不排除有特殊情况在运行时被修改）
- 从执行的最内层作用域开始往外搜寻，找到一个匹配后停止
- 不管函数是在哪里被如何调用的，它的词法作用域都是由这个函数被声明的位置唯一定义的
- 运行时修改词法作用域（非常不好的做法，避免使用）
  - eval，将参数作为 JS 程序执行，当该程序有声明语句时会修改作用域。严格模式将其运行在一个嵌套的作用域中防止污染
  - with，指定一个作用域来运行代码。严格模式下已被禁用
- 函数，一种最常见的作用域，函数内部声明的变量和函数对于外部都是不可见的
- 块作用域，大括号对`{..}`
- `var`和`function`声明的变量会在作用域内提升
- 重复声明一个变量，后者覆盖前者（避免重复声明）
- 垃圾回收, 块作用域结束后其内部变量所占用内存都可被回收
- 动态作用域在运行时确定，JS 中的 this 机制与其类似，关注的是函数如何被调用

示例

一个体现块作用域垃圾回收的例子

```js
function process(data) {
	// do something interesting
}

// anything declared inside this block can go away after!
{
	let someReallyBigData = { .. };

	process( someReallyBigData );
}
```

一个体现词法作用域与动态作用域区别的例子

```js
function foo() {
  console.log(a) // 2
}

function bar() {
  var a = 3
  foo()
}

var a = 2

bar()
```

### 立即调用表达式

简述

> 简称 IIFE，创建局部作用域，主要是为了防止内部变量对外部环境造成影响

要点

- `(function foo(){ .. })()`, 第一对`()`使函数变为函数表达式，第二对`()`执行函数
- 也可以这样写`(function(){ .. }())`,风格选择问题

示例

一种变体，这种模式用在 UMD 项目中

```js
var a = 2

;(function IIFE(def) {
  def(window)
})(function def(global) {
  var a = 3
  console.log(a) // 3
  console.log(global.a) // 2
})
```

### 闭包

简述

> 函数执行结束后仍然可以获取函数内部作用域变量的方式

要点

- 将函数作为值传递到其词法作用域外再去执行的情况都可以称为闭包，此时函数依然可以访问其原词法作用域
- 常用的闭包：回调函数，模块
- 模块包含两个关键点：1，外层函数被执行，创建创建一个封闭作用域，2，外层函数的返回值至少包含一个其内部函数的引用

示例

一个常见的闭包

```js
function wait(message) {
  setTimeout(function timer() {
    console.log(message)
  }, 1000)
}

wait('Hello, closure!')
```

循环与闭包

```js
// 下例输出将与预期不符
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
// 每隔一秒输出一个6

// 通过给每次循环各创建一个作用域来保存循环过程中的i
for (var i = 1; i <= 5; i++) {
  ;(function(j) {
    setTimeout(function timer() {
      console.log(j)
    }, j * 1000)
  })(i)
}
// 每隔一秒分别输出1，2，3，4，5

// 使用let声明for循环中的变量，每次循环都会重新声明一个新的i
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
// 每隔一秒分别输出1，2，3，4，5
```

### Polyfilling

简述

> 在旧环境中兼容新特性的方式, 现有实现如[ES6-Shim](https://github.com/es-shims/es6-shim)

示例

兼容不支持 ES6 的浏览器实现的`Number.isNaN(..)`

```js
if (!Number.isNaN) {
  Number.isNaN = function isNaN(x) {
    return x !== x
  }
}
```

### Transpiling

简述

> 转译，将新的语法转换为等效的旧代码以兼容旧的 JS 引擎, 常见转译器如[Babel](https://babeljs.io)

### 箭头函数

简述

> 更简短的函数;不绑定 this

要点

- 更短的函数
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
- 无其他规则适用时，this 默认绑定到全局，global，window 或 undefined(严格模式下)
- 使用 call，apply 显性绑定 this，使用 bind 强制绑定 this
- 一些内置函数支持传递一个额外参数绑定 this，比如 forEach
- 显性绑定优先于隐性绑定，new 绑定优先于隐性绑定，new 绑定也会覆盖强制绑定
- 判断 this 的几个步骤
  - `var bar = new foo()`, 如果是用 new 绑定，则 this 是新构建的对象
  - `var bar = foo.call( obj2 )`，如果是用 call，apply 显性绑定（包括 bind），则 this 是指定的对象
  - `var bar = obj1.foo()`， 如果函数调用隐性指定了环境，则 this 是该环境对象
  - `var bar = foo()`，否则，默认是全局对象
- 一些例外
  - `foo.call( null )`，如果向 call，apply，bind 指定 null 或者 undefined 作为 this，那将被忽略，转而用默认绑定到全局。相对安全的做法可以传一个绝对空的对象作为 this，如`foo.apply( Object.create( null ), [2, 3] )`
  - 函数间接引用
- 箭头函数使用词法作用域来绑定 this， 作为早期使用`self = this`的一种替代方式

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

一个简单的 bind 函数

```js
function bind(fn, obj) {
  return function() {
    return fn.apply(obj, arguments)
  }
}
```

函数柯里化以及 new 覆盖强制绑定

```js
function foo(p1, p2) {
  this.val = p1 + p2
}

// using `null` here because we don't care about
// the `this` hard-binding in this scenario, and
// it will be overridden by the `new` call anyway!
var bar = foo.bind(null, 'p1')

var baz = new bar('p2')

baz.val // p1p2
```

一个 softBind 函数，如果调用时 this 指向全局，则使用指定的对象作为 this

```js
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function(obj) {
    var fn = this,
      curried = [].slice.call(arguments, 1),
      bound = function bound() {
        return fn.apply(
          !this ||
            (typeof window !== 'undefined' && this === window) ||
            (typeof global !== 'undefined' && this === global)
            ? obj
            : this,
          curried.concat.apply(curried, arguments)
        )
      }
    bound.prototype = Object.create(fn.prototype)
    return bound
  }
}
```

### new 操作符

要点

- 四步
  - 创建一个空对象
  - 将该对象原型指向构造函数的 prototype
  - 绑定该对象为 this 执行构造函数
  - 除非构造函数自身返回了一个对象，否则将返回创建的对象

示例

一个简单实现

```js
function new(func){
	let obj = Object.create(func.prototype)
	let res = func.apply(obj)
	if(typeof res === 'object'){
		return res
	}
	return obj
}
```

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
