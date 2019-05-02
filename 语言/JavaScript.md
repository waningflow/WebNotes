### 箭头函数
简述
 > 更简短的函数;不绑定this

要点
 - 更短的函数
   - 不解释
 - 不绑定this
   - 不会创建自己的this,只会从自己的作用域链的上一层继承this
   - 使用 call(), apply(), bind()方法时，只能传递参数, 不能绑定this, 他们的第一个参数会被忽略
   - 不绑定Arguments对象
   - 不能用作构造器，和 new一起用会抛出错误
   - 没有prototype属性

示例
```
```

疑问
 > 鉴于 this 是词法层面上的，严格模式中与 this 相关的规则都将被忽略

### 关于 this
简述
 > 因为函数可以在不同的运行环境执行，所以需要"this"在函数体内部，指代函数当前的运行环境

要点
 - this的指向取决于函数的调用位置

示例
```js
const a = {
  a: 'a'
};
const obj = {
  getThis: () => this,
  getThis2 () {
    return this;
  }
};
obj.getThis3 = obj.getThis.bind(obj);
obj.getThis4 = obj.getThis2.bind(obj);
const answers = [
  obj.getThis(),
  obj.getThis.call(a),
  obj.getThis2(),
  obj.getThis2.call(a),
  obj.getThis3(),
  obj.getThis3.call(a),
  obj.getThis4(),
  obj.getThis4.call(a)
];

// undefined,undefined,obj,a,undefined,undefined,obj,obj
```
```js
const a = {
  a: 'a'
};
class Obj {
  getThis = () => this
  getThis2 () {
    return this;
  }
}
const obj2 = new Obj();
obj2.getThis3 = obj2.getThis.bind(obj2);
obj2.getThis4 = obj2.getThis2.bind(obj2);
const answers2 = [
  obj2.getThis(),
  obj2.getThis.call(a),
  obj2.getThis2(),
  obj2.getThis2.call(a),
  obj2.getThis3(),
  obj2.getThis3.call(a),
  obj2.getThis4(),
  obj2.getThis4.call(a)
];

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
 - C.prototype用于建立由new C()创建的对象的原型
 - Object.getPrototypeOf(obj)是获取obj对象的原型对象的标准方法
 - obj.__proto__是获取obj对象的原型对象的非标准方法
 - 使用Object.getPrototypeOf()而不要使用__proto__属性
    - 后者在某些情况下表现不可预测，而前者都是有效的，比如对于拥有null原型的对象
    - 后者会污染所有的对象，导致大量bug
 - 始终不要修改__proto__
    - 可移植性问题，不是所有平台都支持修改对象原型 
    - 性能问题，导致浏览器基于对象结构的优化失效
    - 行为无法预测
 - 使用Object.create给新对象设置原型

 示例
 通过构造函数的原型实现继承
 ```js
 function Person () {}
Person.prototype.walk = function () {
  return 'walking ...';
}

function Worker() {}
Worker.prototype = Object.create(Person.prototype);

Worker.prototype.work = function () {
  return 'working ....';
}

function Developer () {}
Developer.prototype = Object.create(Worker.prototype);
Developer.prototype.code = function () {
  return 'coding ....';
}

var dev = new Developer();
dev.code(); // 'coding ...'
dev.work(); // 'working ...'
dev.walk(); // 'walking ...'
 ```
 直接连接各个对象也可以实现继承，但是只有一个实例
 ```js
 var person = {
  walk() { return 'walking...';}
};

var worker = Object.create(person);
worker.work = function () {
  return 'working';
}

var dev = Object.create(worker);
dev.code = function () {
  return 'coding...';
}
dev.code(); // 'coding ...'
dev.work(); // 'working ...'
dev.walk(); // 'walking ...'
 ```
 使用function mixin
 ```js
 /* Define Person's functionalities */
function personFns() {
  this.walk = function () {
    return 'Walking ...';
  };
  this.getName = function () {
    return this.name;
  };
}

/* Define Worker's functionalities */
function workerFns() {
  this.work = function () {
    return 'Working ...';
  };
}

/* Define Developer's functionalities */
function developerFns() {
  this.code = function () {
    return 'Coding ...';
  };
}

/* Define the Developer type */
function Developer(name) {
  if (!(this instanceof Developer)) {
    return new Developer(name);
  }
  this.name = name;
  this.toString = function () {
    return this.name;
  };
}

/* apply each functionalities to
Developer's prototype */
[personFns, workerFns, developerFns].forEach(fn => {
  fn.call(Developer.prototype);
});

/* create an instance and call methods */
const dev = Developer('AJ');
console.log(dev.getName());  //AJ
console.log(dev.walk());     //Walking ...
console.log(dev.work());     //Working ...
console.log(dev.code());     //Coding ...
console.log('Dev is: ' + dev);  //Dev is: AJ
 ```
 class本质
 ```js
 class Car {
  constructor(name) {
    this.name = name;
  }
  move() {
    return 'moving...';
  }
}

const toyota = new Car('Toyota');
toyota.move();

// 等同于下面的代码

function Car(name) {
  this.name = name;
}
Car.prototype.move = function move() {
  return 'moving...';
};

const toyota = new Car('Toyota');
toyota.move();
 ```

### Object.defineProperty()
