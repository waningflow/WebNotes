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
- 变量没有类型 -- 值才有类型
- typeof 的一种特殊的安全防卫行为, 对于未声明的变量返回 undefined
- 内部 [[Class]]，typeof 的结果为 "object" 的值（比如数组）被额外地打上了一个内部的标签属性 [[Class]]，通过`Object.prototype.toString(..)`来查看
- 封箱，访问简单基本类型标量的 length 属性或某些 String.prototype 方法，JS 会自动地“封箱”这个值（用它所对应种类的对象包装器把它包起来），以满足这样的属性/方法访问
- 开箱，取出一个包装器对象底层的基本类型值，可以使用 valueOf() 方法
- 强制转换
  - `ToString`，当任何一个非 string 值被强制转换为一个 string 表现形式时，由 ToString 抽象操作处理
    - string、number、boolean、和 null 值在 JSON 字符串化时，与它们通过 ToString 抽象操作的规则强制转换为 string 值的方式基本上是相同的
    - 如果传递一个 object 值给 JSON.stringify(..)，而这个 object 上拥有一个 toJSON() 方法，那么在字符串化之前，toJSON() 就会被自动调用来将这个值（某种意义上）“强制转换”为 JSON 安全 的
  - `ToNumber`，如果任何非 number 值，以一种要求它是 number 的方式被使用，比如数学操作，就会发生 ToNumber 抽象操作。
  - `ToBoolean`
    - falsy 对象看起来和动起来都像一个普通对象（属性，等等）的值，但是当你强制转换它为一个 boolean 时，它会变为一个 false 值，与包装着 falsy 值的对象并不是一个东西
  - `ToPrimitive`, 查询 valueOf()如果没有返回一个基本类型值，再调用 toString()
- 明确地 Strings 和 Numbers 转换
  - 用 String()和 Number()强制转换
  - 一元操作符将字符串转换为数字，`+"23" === 23`，也可以将 Date 对象转成数字`+new Date()`
  - `~`操作符首先将值“强制转换”为一个 32 位 number 值，然后实施按位取反（翻转每一个比特位）。只有`~-1`产生结果 0，-1 通常称为一个“哨兵值”，因此可以这样`~a.indexOf( "lo" )`
  - `~~`可以将值截断为一个（32 位）整数
  - 从一个字符串中解析出一个数字是 容忍 非数字字符的 —— 从左到右，如果遇到非数字字符就停止解析 —— 而强制转换是 不容忍 并且会失败而得出值 NaN
  - parseInt(..)将它的值强制转换为 string 来实施解析(通过 toString)。`parseInt( 1/0, 19 )`,实质上是`实质上是parseInt( "Infinity", 19 )`
- 明确地：\* --> Boolean
  - Boolean(..)或!!强制转换
- 隐含地：Strings <--> Numbers
  - 如果+的两个操作数之一是一个 string，那么操作就会是 string 连接。否则，它总是数字加法。
- 一个&&或||操作符产生的值不见得是 Boolean 类型。这个产生的值将总是两个操作数表达式其中之一的值
- 在两个 object 被比较的情况下，==和===的行为相同,仅在它们引用 完全相同的值 时 相等,没有强制转换发生
- string 与 number 比较，会先将 string 转换为 number
- `"42" == true // false`,Boolean 会实施 ToNumber(x)，将 true 强制转换为 1。不要使用== true 或== false
- `null == undefined`

示例

typeof 的安全防卫

```js
// 噢，这将抛出一个错误！
if (DEBUG) {
  console.log('Debugging is starting')
}

// 这是一个安全的存在性检查
if (typeof DEBUG !== 'undefined') {
  console.log('Debugging is starting')
}

// 或者检查全局对象
if (window.DEBUG) {
  // ..
}
```

JSON.stringify 相关

```js
JSON.stringify(undefined) // undefined
JSON.stringify(function() {}) // undefined

JSON.stringify([1, undefined, function() {}, 4]) // "[1,null,null,4]"
JSON.stringify({ a: 2, b: function() {} }) // "{"a":2}"

var o = {}

var a = {
  b: 42,
  c: o,
  d: function() {}
}

// 在 `a` 内部制造一个循环引用
o.e = a

// 这会因循环引用而抛出一个错误
// JSON.stringify( a );

// 自定义一个 JSON 值序列化
a.toJSON = function() {
  // 序列化仅包含属性 `b`
  return { b: this.b }
}

JSON.stringify(a) // "{"b":42}"
```

解析和强转

```js
var a = '42'
var b = '42px'

Number(a) // 42
parseInt(a) // 42

Number(b) // NaN
parseInt(b) // 42
```

### 变量

要点

- var 声明的变量在作用域内自动提升
- 访问作用域内不存在的变量会报`ReferenceError`, 给未声明的变量赋值在非严格模式下会在全局作用域创建一个变量，而在严格模式下会报`ReferenceError`
- let 声明的变量在一个 block(`{}`)内有效，在 block 内 let 声明之前称为`TDZ`(暂时性死区)，此时访问变量会报`ReferenceError`

### 值

要点

- 类 array，一个数字索引的值的集合，例如函数的 arguments 对象
- 二进制浮点数的副作用，`0.1 + 0.2 === 0.3; // false`,使用容差值`Number.EPSILON`来比较
- 可以被表示的最大的浮点值大概是 1.798e+308，预定义为 `Number.MAX_VALUE`。在极小的一端，`Number.MIN_VALUE` 大概是 5e-324
- 安全整数范围,可以“安全地”被表示的最大整数是 2^53 - 1,预定义为`Number.MAX_SAFE_INTEGER`,最小值`Number.MIN_SAFE_INTEGER`
- `null` 是一个特殊的关键字，不是一个标识符,`undefined` 是一个持有内建的值 `undefined` 的内建标识符
- `NaN` 是一种一个被赋予了特殊意义的普通的值,`NaN !== NaN`,使用`Number.isNaN(..)`判断
- 特殊等价，使用`Object.is(..)`
- 简单值（也叫基本标量） 总是 通过值拷贝来赋予/传递：null、undefined、string、number、 boolean、以及 ES6 的 symbol
- 复合值 —— object（包括 array，和所有的对象包装器 ）和 function —— 总是 在赋值或传递时创建一个引用的拷贝
- void 操作符允许你从任意另一个值中创建 undefined 值
- JS 中的引用指向一个（共享的） 值，所以如果你有十个不同的引用，它们都总是同一个共享值的不同引用；它们没有一个是另一个的引用/指针

示例

isNaN 的 bug

```js
var a = 2 / 'foo'
var b = 'foo'

a // NaN
b // "foo"

window.isNaN(a) // true
window.isNaN(b) // true -- 噢!
```

Number.isNaN(..)的实现

```js
if (!Number.isNaN) {
  Number.isNaN = function(n) {
    return typeof n === 'number' && window.isNaN(n)
  }
}

var a = 2 / 'foo'
var b = 'foo'

Number.isNaN(a) // true
Number.isNaN(b) // false -- 咻!

// 或者更简单的
if (!Number.isNaN) {
  Number.isNaN = function(n) {
    return n !== n
  }
}
```

检查`-0`

```js
function isNegZero(n) {
  n = Number(n)
  return n === 0 && 1 / n === -Infinity
}

isNegZero(-0) // true
isNegZero(0 / -3) // true
isNegZero(0) // false
```

`Object.is(..)`的填补

```js
if (!Object.is) {
  Object.is = function(v1, v2) {
    // 测试 `-0`
    if (v1 === 0 && v2 === 0) {
      return 1 / v1 === 1 / v2
    }
    // 测试 `NaN`
    if (v1 !== v1) {
      return v2 !== v2
    }
    // 其他情况
    return v1 === v2
  }
}
```

不能使用一个引用来改变另一个引用所指向的值

```js
function foo(x) {
  x.push(4)
  x // [1,2,3,4]

  // 稍后
  x = [4, 5, 6]
  x.push(7)
  x // [4,5,6,7]
}

var a = [1, 2, 3]

foo(a)

a // [1,2,3,4] 不是 [4,5,6,7]
```

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

要点

- 内置对象，`String Number Boolean Object Function Array Date RegExp Error`
- 两种创建方式
  - 字面量
  - 构造函数
- 对象的属性都是 string 类型，也可以是 symbol 类型
- 数组也是对象，可以添加属性，但添加数字类的属性会修改数组内容，如`myArray["3"] = "baz"`
- 对象的复制，深浅拷贝。对象的循环引用，深拷贝何时打破循环还没有一个明确答案。对于 json 安全的对象可以简单的采取这种方式`var newObj = JSON.parse( JSON.stringify( someObj ) );`
- 属性描述符, `Object.defineProperty()`
  - `value`
  - `writable`
  - `enumerable`
  - `configurable`, 是否能修改属性描述符，所以把`configurable`改成`false`是单向操作,无法撤回（但即使`configurable:false`,`writable`也能从`ture`改成`false`）。`configurable:false`也能阻止`delete`属性
- Immutability
  - 组合`writable:false`和`configurable:false`实现属性不变
  - 使用`Object.preventExtensions(..)`阻止添加新属性
  - `Object.seal(..)`
  - `Object.freeze(..)`
- [[Get]],[[Set]],对象默认行为
- Getters & Setters，属性级别
- `in`会查找原型链，而`hasOwnProperty`不会
- 对于`Object.create(null)`创建的对象没有`hasOwnProperty`方法，可以用`Object.prototype.hasOwnProperty.call(myObject,"a")`
- `in`检查的是属性而非值，`4 in [2, 4, 6] === false`
- 对象属性的遍历顺序不确保是一致的
- `for..of`使用的是对象的`@@iterator`,数组有内置的`@@iterator`,所以可以直接遍历数组的值
- 对于`myObject.foo = "bar"`, 当 `foo` 不直接存在于 `myObject`，但 存在 于 `myObject` 的 `[[Prototype]]` 链的更高层时
  - 如果不是`writable:false`,那么直接给`myObject`添加一个新属性`foo`,形成一个 遮蔽属性
  - 如果是`writable:false`，则该赋值操作被忽略，严格模式报错
  - 如果是 setter，那么这个 setter 总是被调用。没有 foo 会被添加到（也就是遮蔽在）myObject 上

示例

关于`in`和`hasOwnProperty`

```js
var myObject = {
  a: 2
}

'a' in myObject // true
'b' in myObject // false

myObject.hasOwnProperty('a') // true
myObject.hasOwnProperty('b') // false
```

关于`enumerable`

```js
var myObject = {}

Object.defineProperty(
  myObject,
  'a',
  // make `a` enumerable, as normal
  { enumerable: true, value: 2 }
)

Object.defineProperty(
  myObject,
  'b',
  // make `b` non-enumerable
  { enumerable: false, value: 3 }
)

myObject.propertyIsEnumerable('a') // true
myObject.propertyIsEnumerable('b') // false

Object.keys(myObject) // ["a"]
Object.getOwnPropertyNames(myObject) // ["a", "b"]
```

关于遍历器

```js
var myArray = [1, 2, 3]
var it = myArray[Symbol.iterator]()

it.next() // { value:1, done:false }
it.next() // { value:2, done:false }
it.next() // { value:3, done:false }
it.next() // { done:true }
```

给对象自定义一个遍历器

```js
var myObject = {
  a: 2,
  b: 3
}

Object.defineProperty(myObject, Symbol.iterator, {
  enumerable: false,
  writable: false,
  configurable: true,
  value: function() {
    var o = this
    var idx = 0
    var ks = Object.keys(o)
    return {
      next: function() {
        return {
          value: o[ks[idx++]],
          done: idx > ks.length
        }
      }
    }
  }
})

// iterate `myObject` manually
var it = myObject[Symbol.iterator]()
it.next() // { value:2, done:false }
it.next() // { value:3, done:false }
it.next() // { value:undefined, done:true }

// iterate `myObject` with `for..of`
for (var v of myObject) {
  console.log(v)
}
// 2
// 3
```

隐含地发生遮蔽

```js
var anotherObject = {
  a: 2
}

var myObject = Object.create(anotherObject)

anotherObject.a // 2
myObject.a // 2

anotherObject.hasOwnProperty('a') // true
myObject.hasOwnProperty('a') // false

myObject.a++ // 噢，隐式遮蔽！

anotherObject.a // 2
myObject.a // 3

myObject.hasOwnProperty('a') // true
```

### 函数

要点

- 所有命名参数都是 arguments 对象中对应索引的别名
- 永远不要修改 arguments 对象，使用[].slice.call(arguments)复制 arguments 之后再修改

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
- `a1.constructor` 是极其不可靠的，一般来说，这样的引用应当尽量避免
- instanceof 运算符用于测试构造函数的 prototype 属性是否出现在对象的原型链中的任何位置
- isPrototypeOf() 方法用于测试一个对象是否存在于另一个对象的原型链上

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

链接原型的方式

```js
// ES6 以前
// 扔掉默认既存的 `Bar.prototype`
Bar.prototype = Object.create(Foo.prototype)

// ES6+
// 修改既存的 `Bar.prototype`
Object.setPrototypeOf(Bar.prototype, Foo.prototype)
```

`__proto__`的简单实现

```js
Object.defineProperty(Object.prototype, '__proto__', {
  get: function() {
    return Object.getPrototypeOf(this)
  },
  set: function(o) {
    // ES6 的 setPrototypeOf(..)
    Object.setPrototypeOf(this, o)
    return o
  }
})
```

### Class

简述

> “类”是一直设计模式，JS 没有“类”, 只有对象

要点

- 传统的类是“复制”，实例化时，行为从类复制到实例，继承时，行为从父类复制到子类
- 多态（在多层继承关系中有相同名称的方法），看起来是子类引用父类的相对链接，其实是行为复制的结果
- JS 中“类”的机制，不是复制，而是原型链
- 所有的函数默认都会得到一个公有的，不可枚举的属性，称为 prototype，它可以指向任意的对象
- “继承”意味着 拷贝 操作，而 JavaScript 不拷贝对象属性）。相反，JS 在两个对象间建立链接，一个对象实质上可以将对属性/函数的访问 委托 到另一个对象上。对于描述 JavaScript 对象链接机制来说，“委托”是一个准确得多的术语
- “构造器”是在前面 用 new 关键字调用的任何函数
- class 很大程度上仅仅是一个既存的 [[Prototype]]（委托）机制的语法糖

示例

super 在声明时静态绑定的，而非调用时动态绑定。解决这个问题可以用 toMethod(..) 来绑定/重绑定方法

```js
class P {
  foo() {
    console.log('P.foo')
  }
}

class C extends P {
  foo() {
    super()
  }
}

var c1 = new C()
c1.foo() // "P.foo"

var D = {
  foo: function() {
    console.log('D.foo')
  }
}

var E = {
  foo: C.prototype.foo
}

// E 链接到 D 来进行委托
Object.setPrototypeOf(E, D)

E.foo() // "P.foo"
```

### 行为委托

简述

> 面向委托的设计

要点

- “OLOO”（objects-linked-to-other-objects（链接到其他对象的对象））风格
- 委托更适于作为内部实现的细节，而不是直接暴露在 API 接口的设计中
- 不允许相互委托，因为如果制造一个在任意一方都不存在的属性/方法引用，就会在 [[Prototype]] 上得到一个无限递归的循环
- “duck typing（鸭子类型）”（谚语：“如果它看起来像鸭子，叫起来像鸭子，那么它一定是一只鸭子”。）
  - 健壮性很差，例如，如果任何对象 恰好有一个 then() 方法，ES6 的 Promises 将会无条件地假设这个对象 是“thenable” 的，而且因此会期望它按照所有的 Promises 标准行为那样一致地动作

### Symbol

简述

> 防止属性名冲突引入的独一无二的值

要点

- 内置的 Symbol 值
  - `Symbol.hasInstance`
  - `Symbol.isConcatSpreadable`
  - `Symbol.species`
  - `Symbol.match`
  - `Symbol.replace`
  - `Symbol.search`
  - `Symbol.split`
  - `Symbol.iterator`, 指向默认遍历器方法
  - `Symbol.toPrimitive`
  - `Symbol.toStringTag`
  - `Symbol.unscopables`

示例

```js
Symbol.for('bar') === Symbol.for('bar')
// true

Symbol('bar') === Symbol('bar')
// false
```
