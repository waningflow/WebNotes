### 箭头函数
起源：
 > 更简短的函数;不绑定this

描述：
 - 更短的函数
   - 不解释
 - 不绑定this
   - 不会创建自己的this,只会从自己的作用域链的上一层继承this
   - 使用 call(), apply(), bind()方法时，只能传递参数, 不能绑定this, 他们的第一个参数会被忽略
   - 不绑定Arguments对象
   - 不能用作构造器，和 new一起用会抛出错误
   - 没有prototype属性

用例:
```
```

疑问：
 > 鉴于 this 是词法层面上的，严格模式中与 this 相关的规则都将被忽略

### 关于 this
起源：
 > 因为函数可以在不同的运行环境执行，所以需要"this"在函数体内部，指代函数当前的运行环境

```
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
```



### new 操作符

### call 函数

### apply 函数

### bind 函数

### promise

### async

### 严格模式

### prototype

### Object.defineProperty()
