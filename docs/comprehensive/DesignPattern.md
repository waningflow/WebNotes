# 设计模式

简述

> 软件设计中解决常见问题的可复用方法

- 创建型设计模式
  - 构造器模式
  - 工厂模式
  - 原型模式
  - 单例模式
- 结构型设计模式
  - 适配器模式
  - 组合模式
  - 装饰器模式
  - 外观模式
  - 享元模式
  - 代理模式
- 行为型设计模式
  - 责任链模式
  - 命令模式
  - 迭代器模式
  - 中介模式
  - 观察者模式
  - 状态模式
  - 策略模式
  - 模板模式

## 构造器模式

```js
// traditional Function-based syntax
function Hero(name, specialAbility) {
  // setting property values
  this.name = name
  this.specialAbility = specialAbility

  // declaring a method on the object
  this.getDetails = function() {
    return this.name + ' can ' + this.specialAbility
  }
}

// ES6 Class syntax
class Hero {
  constructor(name, specialAbility) {
    // setting property values
    this._name = name
    this._specialAbility = specialAbility

    // declaring a method on the object
    this.getDetails = function() {
      return `${this._name} can ${this._specialAbility}`
    }
  }
}

// creating new instances of Hero
const IronMan = new Hero('Iron Man', 'fly')

console.log(IronMan.getDetails()) // Iron Man can fly
```

## 工厂模式
