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
- `null == undefined`,`Number(null) === 0`, `Number(undefined) === NaN`

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

### 文法

要点

- 两个概念，“表达式”和“语句”
- 所有语句都有完成值
- 不能以任何简单的语法/文法来捕获一个语句的完成值并将它赋值给另一个变量
- 表达式副作用, 表达式求值过程中修改了某些变量的值（个人理解）
- `labeled statements`，知道就行了
- JS 文法隐藏的性质：它没有 else if,如果附着在 if 和 else 语句后面的代码块儿仅包含一个语句时，if 和 else 语句允许省略这些代码块儿周围的{ }
- 操作符优先级[参考](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
- 短接，对于&&和||两个操作符来说，如果左手边的操作数足够确定操作的结果，那么右手边的操作数将 不会被求值
- 结合性，一般来说，操作符不是左结合的就是右结合的，这要看 分组是从左边发生还是从右边发生，例如，&&和||是左结合的，`? :`是右结合的，`a ? b : c ? d : e`等同于`a ? b : (c ? d : e)`,`=`操作符是右结合的，`a = b = c = 42`等同于`a = (b = (c = 42))`
- 自动分号,ASI(Automatic Semicolon Insertion —— 自动分号插入),ASI 将仅在换行存在时起作用,分号不会被插入一行的中间
- JS 中的“宗教战争”
  - 制表还是空格
  - 是否应当严重/唯一地依赖 ASI
- ES6 定义的 TDZ 指的是代码中还不能使用变量引用的地方，虽然 typeof 有一个例外，它对于未声明的变量是安全的(undefined)，但是对于 TDZ 引用却没有这样的安全例外(ReferenceError)
- 使用 ES6 的参数默认值时，如果你省略一个参数，或者你在它的位置上传递一个 undefined 值的话，就会应用这个默认值
- 错误类型，“早期”（编译器抛出的不可捕获的）和“运行时”（可以 try..catch 的）
- 在 finally 子句中的代码 总是 运行的（无论发生什么），而且它总是在 try（和 catch，如果存在的话）完成后立即运行,一个在 finally 内部的 return 有着覆盖前一个 try 或 catch 子句中的 return 的特殊能力
- 一些实现的限制
  - 在字符串字面量（不是一个字符串变量）中允许出现的最大字符个数
  - 在一个函数调用的参数值中可以发送的数据的大小（字节数，也称为栈的大小）
  - 在一个函数声明中的参数数量
  - 没有经过优化的调用栈最大深度（比如，使用递归时）：从一个函数到另一个函数的调用链能有多长
  - JS 程序可以持续运行并阻塞浏览器的秒数
  - 变量名的最大长度

示例

`++`用于后缀，递增发生在值从表达式中返回之后

```js
var a = 42
var b = a++

a // 43
b // 42
```

`,`语句序列逗号操作符,将多个独立的表达式语句连成一个单独的语句

```js
var a = 42,
  b
b = (a++, a)

a // 43
b // 43
```

赋值表达式得出被赋予的值用于链式赋值

```js
var a, b, c

a = b = c = 42
```

continue 和 break 语句都可以选择性地接受一个指定的标签，程序流会有些像 goto 一样“跳转”

```js
// 用`foo`标记的循环
foo: for (var i = 0; i < 4; i++) {
  for (var j = 0; j < 4; j++) {
    // 每当循环相遇，就继续外层循环
    if (j == i) {
      // 跳到被`foo`标记的循环的下一次迭代
      continue foo
    }

    // 跳过奇数的乘积
    if ((j * i) % 2 == 1) {
      // 内层循环的普通（没有被标记的） `continue`
      continue
    }

    console.log(i, j)
  }
}
// 1 0
// 2 0
// 2 1
// 3 0
// 3 2
```

原来 js 里面并没有 else if...

```js
if (a) {
  // ..
} else if (b) {
  // ..
} else {
  // ..
}
// 实际被解析为
if (a) {
  // ..
} else {
  if (b) {
    // ..
  } else {
    // ..
  }
}
```

一个变态的例子

```js
var a = 42
var b = 'foo'
var c = false

var d = (a && b) || c ? (c || b ? a : c && b) : a

d // ??

// 根据操作符优先级顺序，等同于
;(a && b) || c ? (c || b ? a : c && b) : a
```

`try...finally`

```js
function foo() {
  try {
    throw 42
  } finally {
    console.log('Hello')
  }

  console.log('never runs')
}

console.log(foo())
// Hello
// Uncaught Exception: 42
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

### 异步

简述

> 单线程事件轮询队列

要点

- 事件轮询，有一个持续不断的循环，这个循环的每一次迭代称为一个“tick”。在每一个“tick”中，如果队列中有一个事件在等待，它就会被取出执行。这些事件就是你的函数回调
- 在任意给定的时刻，一次只有一个队列中的事件可以被处理。当事件执行时，他可以直接或间接地导致一个或更多的后续事件
- 并发是当两个或多个事件链条随着事件相互穿插，因此从高层的角度来看，它们在 同时 运行(即便在给定的某一时刻只有一个事件在被处理)
  - 单线程事件轮询
  - 协作
- 竞合状态，非互动，互动
- “工作队列”是一个挂靠在事件轮询队列的每个 tick 末尾的队列
- 语句排序,代码中表达语句的顺序没有必要与 JS 引擎执行它们的顺序相同

### 回调

简述

> JavaScript 最基础的异步模式

要点

- "缺乏顺序性"。 顺序的，阻塞的大脑规划行为和面向回调的异步代码不能很好地匹配
- "缺乏可靠性"。回调函数的执行情况难以保证，尤其是使用第三方工具时，出现控制反转的信任问题
- 尝试拯救回调
  - 提供了分离的回调（一个用作成功的通知，一个用作错误的通知）
  - 错误优先风格（Node 风格），一个回调的第一个参数为一个错误对象保留（如果有的话）。如果成功，这个参数将会是空/falsy（而其他后续的参数将是成功的数据），但如果出现了错误的结果，这第一个参数就会被设置/truthy
  - 回调从不被调用的信任问题，通过设置超时来取消事件
  - 总是异步地调用回调

示例

一个将函数异步化的例子

```js
function asyncify(fn) {
  var orig_fn = fn,
    intv = setTimeout(function() {
      intv = null
      if (fn) fn()
    }, 0)
  fn = null

  return function() {
    // 触发太快，在`intv`计时器触发来
    // 表示异步回合已经过去之前？
    if (intv) {
      fn = orig_fn.bind.apply(
        orig_fn,
        // 将包装函数的`this`加入`bind(..)`调用的
        // 参数，同时currying其他所有的传入参数
        [this].concat([].slice.call(arguments))
      )
    }
    // 已经是异步
    else {
      // 调用原版的函数
      orig_fn.apply(this, arguments)
    }
  }
}
```

### promise

简述

> 一种用来包装与组合 未来值，并且可以很容易复用的机制

要点

- 使用回调，“通知”就是被任务（foo(..)）调用的我们的回调函数。但是使用 Promise，我们将关系扭转过来，我们希望能够监听一个来自于 foo(..)的事件，当我们被通知时，做相应的处理。
- 事件监听的方式是一种反转回调模式
- 识别一个 Promise 的方法是定义一种称为“thenable”的东西，也就是任何拥有 then(..)方法的对象或函数, “鸭子类型检查”。如果不小心有个函数或者对象拥有 then 函数，就糟了
- Promise 的信任，（根据工作队列来分析）
  - 调用回调太早。then(..)总是被异步调用，自动地防止了 Zalgo 效应
  - 调用回调太晚（或根本不调）
    - 链接在两个分离的 Promise 上的回调之间的相对顺序不可预测
    - Promise.race 设置超时
  - 调用回调太少或太多次。一个 Promise 仅能被解析一次，所以任何 then(..)上注册的（每个）回调将仅仅被调用一次
  - 没能传递必要的环境/参数。Promise 可以拥有最多一个解析值
  - 吞掉了任何可能发生的错误/异常。如果在 Promise 的创建过程中的任意一点，或者在监听它的解析的过程中，一个 JS 异常错误发生的话，比如 TypeError 或 ReferenceError，这个异常将会被捕获，并且强制当前的 Promise 变为拒绝
- 链式流程
  - 在一个 Promise 上调用 then(..)创建并返回一个新的 Promise
  - then(..)的返回值做为被链接的 Promise 的完成值
  - 假定的拒绝处理器仅仅简单地重新抛出错误，默认的完成处理器简单地将它收到的任何值传递给下一步
  - 错误持续地在 Promise 链上传播，直到遇到一个明确定义的拒绝处理器
- Promise.resolve(..)将会直接返回收到的纯粹的 Promise，或者将收到的 thenable 展开。如果展开这个 thenable 之后是一个拒绝状态，那么从 Promise.resolve(..)返回的 Promise 事实上是相同的拒绝状态
- reject(..) 不会 像 resolve(..)那样进行展开,后续的拒绝处理器将会受到你传递给 reject(..)的实际的 Promise/thenable，而不是它底层的立即值
- 错误处理
  - `try..catch`仅能用于同步状态
  - `then`中抛出的错误只有在其链接的 promise 中可以捕获
  - Promise 的错误处理是一种“绝望的深渊”的设计。默认情况下，它假定你想让所有的错误都被 Promise 的状态吞掉，而且如果你忘记监听这个状态，错误就会默默地凋零/死去
  - 为了回避把一个被遗忘/抛弃的 Promise 的错误无声地丢失，一些开发者宣称 Promise 链的“最佳实践”是，总是将你的链条以 catch(..)终结,但如果 catch 中也有错误呢...
  - 处理未被捕获的错误
    - 一些 Promise 库有一些附加的方法，可以注册某些类似于“全局的未处理拒绝”的处理器。使用一个任意长的计时器，比如说 3 秒，从拒绝的那一刻开始计时。如果一个 Promise 被拒绝但没有错误处理在计时器被触发前注册，那么它就假定你不会注册监听器了，所以它是“未被捕获的”
    - 一种常见的建议是，Promise 应当增加一个 done(..)方法
  - 理论上的探讨
    - Promise 可以默认为是报告(向开发者控制台)一切拒绝的，就在下一个 Job 或事件轮询 tick，如果就在这时 Promise 上没有注册任何错误处理器
    - 如果你希望拒绝的 Promise 在被监听前，将其拒绝状态保持一段不确定的时间。你可以调用 defer()，它会压制这个 Promise 自动报告错误
- `Promise.all([ .. ])`, Promise.resolve(..)返回的主 Promise 将会在所有组成它的 promise 完成之后才会被完成。如果其中任意一个 promise 被拒绝，Promise.all([ .. ])的主 Promise 将立即被拒绝，并放弃所有其他 promise 的结果
- `Promise.race([ .. ])`, 在任意一个 Promise 解析为完成时完成，而且它会在任意一个 Promise 解析为拒绝时拒绝
- 被丢弃/忽略的 promise 发生了什么?Promise 不能被取消,只能被无声地忽略,这种模式中存在某种东西可以在超时后主动释放被占用的资源，或者取消任何它可能带来的副作用吗
  - 一些开发者提议，Promise 需要一个 finally(..)回调注册机制，它总是在 Promise 解析时被调用，而且允许你制定任何可能的清理操作
  - 制造一个静态的帮助工具观察（但不干涉）Promise 的解析
- `all([ .. ])` 与 `race([ .. ])` 的变种
  - `none([ .. ])`,所有的 Promise 都需要被拒绝
  - `any([ .. ])`,忽略任何拒绝，只有一个需要完成即可
  - `first([ .. ])`,忽略任何拒绝，而且一旦有一个 Promise 完成时，就立即完成
  - `last([ .. ])`很像`first([ .. ])`，但是只有最后一个完成胜出。
- 如果一个空的 array 被传入 Promise.all([ .. ])，它会立即完成，但 Promise.race([ .. ])却会永远挂起，永远不会解析
- Promise 只能有一个单独的完成值或一个单独的拒绝理由
  - 展开参数
- 一个 Promise 只能被解析一次（成功或拒绝）
- Promise 不可撤销,许多 Promise 抽象库都提供取消 Promise 的功能,这违反了未来值的可靠性原则（外部不可变）

示例

错误处理

```js
var p = Promise.resolve(42)

p.then(
  function fulfilled(msg) {
    // 数字没有字符串方法,
    // 所以这里抛出一个错误
    console.log(msg.toLowerCase())
  },
  function rejected(err) {
    // 永远不会到这里
  }
)
```

实现的一个`Promise.first`

```js
// 填补的安全检查
if (!Promise.first) {
  Promise.first = function(prs) {
    return new Promise(function(resolve, reject) {
      let rejectError = []
      // 迭代所有的promise
      prs.forEach(function(pr) {
        // 泛化它的值
        Promise.resolve(pr)
          // 无论哪一个首先成功完成，都由它来解析主promise
          .then(resolve, function(err) {
            rejectError.push(err)
            // 在所有的promise都被拒绝时拒绝,返回最后一个错误
            if (rejectError.length === prs.length) {
              reject(rejectError)
            }
          })
      })
    })
  }
}
```

展开参数

```js
function spread(fn) {
  // 返回一个apply固定第一个参数是null
  return Function.prototype.apply.bind(fn, null)
}

Promise.all(foo(10, 20)).then(
  spread(function(x, y) {
    console.log(x, y) // 200 599
  })
)

// ES6的方式更简单
Promise.all(foo(10, 20)).then(function([x, y]) {
  console.log(x, y) // 200 599
})
```

"promise 化"简单实现

```js
// 填补的安全检查
if (!Promise.wrap) {
  Promise.wrap = function(fn) {
    return function() {
      var args = [].slice.call(arguments)

      return new Promise(function(resolve, reject) {
        fn.apply(
          null,
          args.concat(function(err, v) {
            if (err) {
              reject(err)
            } else {
              resolve(v)
            }
          })
        )
      })
    }
  }
}
```

### generator

简述

> 一种可以运行中暂停的函数

要点

- yield 和 next(..)进行双向消息传递
- 多迭代器实现语句穿插(了解即可)
- 迭代器 是一个明确定义的接口，用来逐个通过一系列从发生器得到的值
- `for..of`循环为每一次迭代自动调用 next()——他不会给 next()传入任何值——而且他将会在收到一个`done:true`时自动终结
- 异步地迭代 Generator
- Generators + Promises
  - 带有 Promise 的 Generator 运行器, （现在的 async，await）
  - Generator 中的 Promise 并发，并行的发起异步，然后使用两个连续的 yield 语句等待并从 promise 中取得解析值
  - 将 promise 逻辑作为实现细节隐藏起来
- Generator 委托
  - yield 委托`yield *`
- Generator 并发
  - CSP（Communicating Sequential Processes——通信顺序处理）
- Thunks,将多参数函数替换成单参数的版本，且只接受回调函数作为参数
- generator 可以为了异步而 yield Promise，也可以为异步而 yield thunk。我们需要的只是一个更聪明的 run(..)工具
- generator兼容旧环境，[自动转译](https://facebook.github.io/regenerator/)

示例

一个迭代器

```js
var something = (function() {
  var nextVal

  return {
    // `for..of`循环需要这个
    [Symbol.iterator]: function() {
      return this
    },

    // 标准的迭代器接口方法
    next: function() {
      if (nextVal === undefined) {
        nextVal = 1
      } else {
        nextVal = 3 * nextVal + 6
      }

      return { done: false, value: nextVal }
    }
  }
})()

something.next().value // 1
something.next().value // 9
something.next().value // 33
something.next().value // 105
```

一个 generator 运行器

```js
function run(gen) {
  var args = [].slice.call(arguments, 1),
    it

  // 在当前的上下文环境中初始化generator
  it = gen.apply(this, args)

  // 为generator的完成返回一个promise
  return Promise.resolve().then(function handleNext(value) {
    // 运行至下一个让出的值
    var next = it.next(value)

    return (function handleResult(next) {
      // generator已经完成运行了？
      if (next.done) {
        return next.value
      }
      // 否则继续执行
      else {
        return Promise.resolve(next.value).then(
          // 在成功的情况下继续异步循环，将解析的值送回generator
          handleNext,

          // 如果`value`是一个拒绝的promise，就将错误传播回generator自己的错误处理, 同时要继续往下走流程,不能因为一个err就停止
          function handleErr(err) {
            return Promise.resolve(it.throw(err)).then(handleResult)
          }
        )
      }
    })(next)
  })
}
```

yield 委托

```js
function* foo() {
  console.log('`*foo()` starting')
  yield 3
  yield 4
  console.log('`*foo()` finished')
}

function* bar() {
  yield 1
  yield 2
  yield* foo() // `yield`-delegation!
  yield 5
}

var it = bar()

it.next().value // 1
it.next().value // 2
it.next().value // `*foo()` starting
// 3
it.next().value // 4
it.next().value // `*foo()` finished
// 5
```

递归委托

```js
function* foo(val) {
  if (val > 1) {
    // 递归委托
    val = yield* foo(val - 1)
  }

  return yield request('http://some.url/?v=' + val)
}

function* bar() {
  var r1 = yield* foo(3)
  console.log(r1)
}

run(bar)
```

一个 thunkify

```js
// thunkory，产生一个thunk
function thunkify(fn) {
  var args = [].slice.call(arguments, 1)
  return function(cb) {
    args.push(cb)
    return fn.apply(null, args)
  }
}

// thunkify，产生一个thunkory（制造thunk的函数）
function thunkify(fn) {
  return function() {
    var args = [].slice.call(arguments)
    return function(cb) {
      args.push(cb)
      return fn.apply(null, args)
    }
  }
}
```

比较 thunkify(..)和 promisify(..)

```js
// 对称的：构建问题的回答者
var fooThunkory = thunkify(foo)
var fooPromisory = promisify(foo)

// 对称的：提出问题
var fooThunk = fooThunkory(3, 4)
var fooPromise = fooPromisory(3, 4)

// 取得 thunk 的回答
fooThunk(function(err, sum) {
  if (err) {
    console.error(err)
  } else {
    console.log(sum) // 7
  }
})

// 取得 promise 的回答
fooPromise.then(
  function(sum) {
    console.log(sum) // 7
  },
  function(err) {
    console.error(err)
  }
)
```

### async

简述

> Generator 函数的语法糖

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
