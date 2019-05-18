# 算法

## 冒泡排序

- 依次两两比较，大数右移，以此重复。复杂度 O(n^2)

```js
function sort(arr) {
  for (let i = arr.length; i > 1; i--) {
    for (let j = 0; j < i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}
```

## 插入排序

- 从第二个元素开始，向左比较，小数左移，以此重复。复杂度 O(n^2)

```js
function sort(arr) {
  for (let i = 1; i <= arr.length - 1; i++) {
    for (let j = i; j > 0 && arr[j] < arr[j - 1]; j--) {
      ;[arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
    }
  }
  return arr
}
```

## 选择排序

- 遍历数组，找出最小值索引，与第一个元素交换，以此重复。复杂度 O(n^2)

```js
function sort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  return arr
}
```

## 动态规划（DP）

简述

> 将一个问题拆成几个子问题，分别求解这些子问题，即可推断出大问题的解

要点

- 几个概念
  - 无后效性，“未来与过去无关”（如果给定某一阶段的状态，则在这一阶段以后过程的发展不受这阶段以前各段状态的影响）
  - 最优子结构，大问题的最优解可以由小问题的最优解推出
- 如何判断一个问题能否使用 DP 解决？
  - 能将大问题拆成几个小问题，且满足无后效性、最优子结构性质
- 典型问题
  - DAG最短路f(P)=min⁡\{f(R)+w~R→P~}，其中R为有路通到P的所有的点， ![w_{R→P}](https://www.zhihu.com/equation?tex=w_%7BR%E2%86%92P%7D) 为R到P的过路费
- 核心思想：尽量缩小可能解空间
- 如何设计DP算法
  - 把我们面对的局面表示为x。这一步称为设计状态
  - 对于状态x，记我们要求出的答案(e.g. 最小费用)为f(x).我们的目标是求出f(T)。找出f(x)与哪些局面有关（记为p），写出一个式子（称为状态转移方程），通过f(p)来推出f(x)
- DP三连
  - 我是谁？ ——设计状态，表示局面
  - 我从哪里来？
  - 我要到哪里去？ ——设计转移
