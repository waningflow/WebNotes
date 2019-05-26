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

- 基于类

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

- 基于类

```js
class BallFactory {
  constructor() {
    this.createBall = function(type) {
      let ball
      if (type === 'football' || type === 'soccer') ball = new Football()
      else if (type === 'basketball') ball = new Basketball()
      ball.roll = function() {
        return `The ${this._type} is rolling.`
      }

      return ball
    }
  }
}

class Football {
  constructor() {
    this._type = 'football'
    this.kick = function() {
      return 'You kicked the football.'
    }
  }
}

class Basketball {
  constructor() {
    this._type = 'basketball'
    this.bounce = function() {
      return 'You bounced the basketball.'
    }
  }
}

// creating objects
const factory = new BallFactory()

const myFootball = factory.createBall('football')
const myBasketball = factory.createBall('basketball')

console.log(myFootball.roll()) // The football is rolling.
console.log(myBasketball.roll()) // The basketball is rolling.
console.log(myFootball.kick()) // You kicked the football.
console.log(myBasketball.bounce()) // You bounced the basketball.
```

## 原型模式

- 基于对象

```js
// using Object.create as was recommended by ES5 standard
const car = {
  noOfWheels: 4,
  start() {
    return 'started'
  },
  stop() {
    return 'stopped'
  }
}

// Object.create(proto[, propertiesObject])

const myCar = Object.create(car, { owner: { value: 'John' } })

console.log(myCar.__proto__ === car) // true
```

## 单例模式

- 一个类只存在一个实例

```js
class Database {
  constructor(data) {
    if (Database.exists) {
      return Database.instance
    }
    this._data = data
    Database.instance = this
    Database.exists = true
    return this
  }

  getData() {
    return this._data
  }

  setData(data) {
    this._data = data
  }
}

// usage
const mongo = new Database('mongo')
console.log(mongo.getData()) // mongo

const mysql = new Database('mysql')
console.log(mysql.getData()) // mongo
```

## 适配器模式

- 新老接口适配

```js
// old interface
class OldCalculator {
  constructor() {
    this.operations = function(term1, term2, operation) {
      switch (operation) {
        case 'add':
          return term1 + term2
        case 'sub':
          return term1 - term2
        default:
          return NaN
      }
    }
  }
}

// new interface
class NewCalculator {
  constructor() {
    this.add = function(term1, term2) {
      return term1 + term2
    }
    this.sub = function(term1, term2) {
      return term1 - term2
    }
  }
}

// Adapter Class
class CalcAdapter {
  constructor() {
    const newCalc = new NewCalculator()

    this.operations = function(term1, term2, operation) {
      switch (operation) {
        case 'add':
          // using the new implementation under the hood
          return newCalc.add(term1, term2)
        case 'sub':
          return newCalc.sub(term1, term2)
        default:
          return NaN
      }
    }
  }
}

// usage
const oldCalc = new OldCalculator()
console.log(oldCalc.operations(10, 5, 'add')) // 15

const newCalc = new NewCalculator()
console.log(newCalc.add(10, 5)) // 15

const adaptedCalc = new CalcAdapter()
console.log(adaptedCalc.operations(10, 5, 'add')) // 15;
```

## 装饰器模式

```js
class Book {
  constructor(title, author, price) {
    this._title = title
    this._author = author
    this.price = price
  }

  getDetails() {
    return `${this._title} by ${this._author}`
  }
}

// decorator 1
function giftWrap(book) {
  book.isGiftWrapped = true
  book.unwrap = function() {
    return `Unwrapped ${book.getDetails()}`
  }

  return book
}

// decorator 2
function hardbindBook(book) {
  book.isHardbound = true
  book.price += 5
  return book
}

// usage
const alchemist = giftWrap(new Book('The Alchemist', 'Paulo Coelho', 10))

console.log(alchemist.isGiftWrapped) // true
console.log(alchemist.unwrap()) // 'Unwrapped The Alchemist by Paulo Coelho'

const inferno = hardbindBook(new Book('Inferno', 'Dan Brown', 15))

console.log(inferno.isHardbound) // true
console.log(inferno.price) // 20
```

## 外观模式

- 将复杂的逻辑隐藏在简单的 api 之下

## 享元模式

- 尽可能多的共享数据，减少应用程序中内存的使用

```js
// flyweight class
class Icecream {
  constructor(flavour, price) {
    this.flavour = flavour
    this.price = price
  }
}

// factory for flyweight objects
class IcecreamFactory {
  constructor() {
    this._icecreams = []
  }

  createIcecream(flavour, price) {
    let icecream = this.getIcecream(flavour)
    if (icecream) {
      return icecream
    } else {
      const newIcecream = new Icecream(flavour, price)
      this._icecreams.push(newIcecream)
      return newIcecream
    }
  }

  getIcecream(flavour) {
    return this._icecreams.find(icecream => icecream.flavour === flavour)
  }
}

// usage
const factory = new IcecreamFactory()

const chocoVanilla = factory.createIcecream('chocolate and vanilla', 15)
const vanillaChoco = factory.createIcecream('chocolate and vanilla', 15)

// reference to the same object
console.log(chocoVanilla === vanillaChoco) // true
```

## 代理模式

```js
// Target
function networkFetch(url) {
  return `${url} - Response from network`
}

// Proxy
// ES6 Proxy API = new Proxy(target, handler);
const cache = []
const proxiedNetworkFetch = new Proxy(networkFetch, {
  apply(target, thisArg, args) {
    const urlParam = args[0]
    if (cache.includes(urlParam)) {
      return `${urlParam} - Response from cache`
    } else {
      cache.push(urlParam)
      return Reflect.apply(target, thisArg, args)
    }
  }
})

// usage
console.log(proxiedNetworkFetch('dogPic.jpg')) // 'dogPic.jpg - Response from network'
console.log(proxiedNetworkFetch('dogPic.jpg')) // 'dogPic.jpg - Response from cache'
```

## 责任链模式

- 如事件冒泡和链式调用

```js
class CumulativeSum {
  constructor(intialValue = 0) {
    this.sum = intialValue
  }

  add(value) {
    this.sum += value
    return this
  }
}

// usage
const sum1 = new CumulativeSum()
console.log(
  sum1
    .add(10)
    .add(2)
    .add(50).sum
) // 62

const sum2 = new CumulativeSum(10)
console.log(
  sum2
    .add(10)
    .add(20)
    .add(5).sum
) // 45
```

## 命令模式

- 将方法的调用,请求或者操作封装到一个单独的对象中

```js
class SpecialMath {
  constructor(num) {
    this._num = num
  }

  square() {
    return this._num ** 2
  }

  cube() {
    return this._num ** 3
  }

  squareRoot() {
    return Math.sqrt(this._num)
  }
}

class Command {
  constructor(subject) {
    this._subject = subject
    this.commandsExecuted = []
  }
  execute(command) {
    this.commandsExecuted.push(command)
    return this._subject[command]()
  }
}

// usage
const x = new Command(new SpecialMath(5))
x.execute('square')
x.execute('cube')

console.log(x.commandsExecuted) // ['square', 'cube']
```

## 迭代器模式

- 顺序访问集合对象的元素，不需要知道集合对象的底层表示

```js
// using Iterator
class IteratorClass {
  constructor(data) {
    this.index = 0
    this.data = data
  }

  [Symbol.iterator]() {
    return {
      next: () => {
        if (this.index < this.data.length) {
          return { value: this.data[this.index++], done: false }
        } else {
          this.index = 0 // to reset iteration status
          return { done: true }
        }
      }
    }
  }
}

// using Generator
function* iteratorUsingGenerator(collection) {
  var nextIndex = 0

  while (nextIndex < collection.length) {
    yield collection[nextIndex++]
  }
}

// usage
const gen = iteratorUsingGenerator(['Hi', 'Hello', 'Bye'])

console.log(gen.next().value) // 'Hi'
console.log(gen.next().value) // 'Hello'
console.log(gen.next().value) // 'Bye'
```

## 中介模式

```js
class TrafficTower {
  constructor() {
    this._airplanes = []
  }

  register(airplane) {
    this._airplanes.push(airplane)
    airplane.register(this)
  }

  requestCoordinates(airplane) {
    return this._airplanes
      .filter(plane => airplane !== plane)
      .map(plane => plane.coordinates)
  }
}

class Airplane {
  constructor(coordinates) {
    this.coordinates = coordinates
    this.trafficTower = null
  }

  register(trafficTower) {
    this.trafficTower = trafficTower
  }

  requestCoordinates() {
    if (this.trafficTower) return this.trafficTower.requestCoordinates(this)
    return null
  }
}

// usage
const tower = new TrafficTower()

const airplanes = [new Airplane(10), new Airplane(20), new Airplane(30)]
airplanes.forEach(airplane => {
  tower.register(airplane)
})

console.log(airplanes.map(airplane => airplane.requestCoordinates()))
// [[20, 30], [10, 30], [10, 20]]
```

## 观察者模式

- 一（发布者）对多（订阅者）

```js
class Subject {
  constructor() {
    this._observers = []
  }

  subscribe(observer) {
    this._observers.push(observer)
  }

  unsubscribe(observer) {
    this._observers = this._observers.filter(obs => observer !== obs)
  }

  fire(change) {
    this._observers.forEach(observer => {
      observer.update(change)
    })
  }
}

class Observer {
  constructor(state) {
    this.state = state
    this.initialState = state
  }

  update(change) {
    let state = this.state
    switch (change) {
      case 'INC':
        this.state = ++state
        break
      case 'DEC':
        this.state = --state
        break
      default:
        this.state = this.initialState
    }
  }
}

// usage
const sub = new Subject()

const obs1 = new Observer(1)
const obs2 = new Observer(19)

sub.subscribe(obs1)
sub.subscribe(obs2)

sub.fire('INC')

console.log(obs1.state) // 2
console.log(obs2.state) // 20
```

## 状态模式

- 行为是基于状态改变

```js
class TrafficLight {
  constructor() {
    this.states = [new GreenLight(), new RedLight(), new YellowLight()]
    this.current = this.states[0]
  }

  change() {
    const totalStates = this.states.length
    let currentIndex = this.states.findIndex(light => light === this.current)
    if (currentIndex + 1 < totalStates)
      this.current = this.states[currentIndex + 1]
    else this.current = this.states[0]
  }

  sign() {
    return this.current.sign()
  }
}

class Light {
  constructor(light) {
    this.light = light
  }
}

class RedLight extends Light {
  constructor() {
    super('red')
  }

  sign() {
    return 'STOP'
  }
}

class YellowLight extends Light {
  constructor() {
    super('yellow')
  }

  sign() {
    return 'STEADY'
  }
}

class GreenLight extends Light {
  constructor() {
    super('green')
  }

  sign() {
    return 'GO'
  }
}

// usage
const trafficLight = new TrafficLight()

console.log(trafficLight.sign()) // 'GO'
trafficLight.change()

console.log(trafficLight.sign()) // 'STOP'
trafficLight.change()

console.log(trafficLight.sign()) // 'STEADY'
trafficLight.change()

console.log(trafficLight.sign()) // 'GO'
trafficLight.change()

console.log(trafficLight.sign()) // 'STOP'
```

## 策略模式

- 行为或算法可以在运行时更改
- 定义一系列的算法,把它们一个个封装起来, 并且使它们可相互替换

```js
// encapsulation
class Commute {
  travel(transport) {
    return transport.travelTime()
  }
}

class Vehicle {
  travelTime() {
    return this._timeTaken
  }
}

// strategy 1
class Bus extends Vehicle {
  constructor() {
    super()
    this._timeTaken = 10
  }
}

// strategy 2
class Taxi extends Vehicle {
  constructor() {
    super()
    this._timeTaken = 5
  }
}

// strategy 3
class PersonalCar extends Vehicle {
  constructor() {
    super()
    this._timeTaken = 3
  }
}

// usage
const commute = new Commute()

console.log(commute.travel(new Taxi())) // 5
console.log(commute.travel(new Bus())) // 10
```

## 模板模式

```js
class Employee {
  constructor(name, salary) {
    this._name = name
    this._salary = salary
  }

  work() {
    return `${this._name} handles ${
      this.responsibilities() /* gap to be filled by subclass */
    }`
  }

  getPaid() {
    return `${this._name} got paid ${this._salary}`
  }
}

class Developer extends Employee {
  constructor(name, salary) {
    super(name, salary)
  }

  // details handled by subclass
  responsibilities() {
    return 'application development'
  }
}

class Tester extends Employee {
  constructor(name, salary) {
    super(name, salary)
  }

  // details handled by subclass
  responsibilities() {
    return 'testing'
  }
}

// usage
const dev = new Developer('Nathan', 100000)
console.log(dev.getPaid()) // 'Nathan got paid 100000'
console.log(dev.work()) // 'Nathan handles application development'

const tester = new Tester('Brian', 90000)
console.log(tester.getPaid()) // 'Brian got paid 90000'
console.log(tester.work()) // 'Brian handles testing'
```
