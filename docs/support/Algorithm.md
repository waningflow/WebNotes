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

## 归并排序

- 分成两半，分别排序，然后合并，以此递归。复杂度 O(NlogN)

```js
function sort(arr) {
  function merge(nums1, m, nums2, n) {
    let i = m - 1
    let j = n - 1
    while (i >= 0 || j >= 0) {
      if (j < 0 || nums1[i] > nums2[j]) {
        nums1[i + j + 1] = nums1[i]
        i--
      } else {
        nums1[i + j + 1] = nums2[j]
        j--
      }
    }
  }

  function mergeSort(arr, left, right) {
    if (left === right) {
      return
    }
    let mid = left + parseInt((right - left) >> 1)
    mergeSort(arr, left, mid)
    mergeSort(arr, mid + 1, right)

    let a1 = []
    let a2 = []
    for (let i = 0; i <= mid - left; i++) {
      a1[i] = arr[left + i]
    }
    for (let i = 0; i < right - mid; i++) {
      a2[i] = arr[mid + 1 + i]
    }
    merge(a1, mid - left + 1, a2, right - mid)
    for (let i = 0; i <= right - left; i++) {
      arr[left + i] = a1[i]
    }
  }
  mergeSort(arr, 0, arr.length - 1)
  return arr
}
```

## 快速排序

- 随机选一个数，比该数小的放左边，大的放右边，两侧递归。复杂度 O(LogN)

```js
function sort(arr) {
  if (arr.length <= 1) {
    return arr.slice()
  }
  let baseIndex = Math.floor(arr.length * Math.random())
  let left = [],
    right = []
  for (let i = 0; i < arr.length; i++) {
    if (i === baseIndex) {
      continue
    }
    if (arr[i] < arr[baseIndex]) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return [...sort(left), arr[baseIndex], ...sort(right)]
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
  - DAG 最短路
  - 0 - 1 背包问题
  - 最长递增子序列
- 核心思想：尽量缩小可能解空间
- 如何设计 DP 算法
  - 把我们面对的局面表示为 x。这一步称为设计状态
  - 对于状态 x，记我们要求出的答案(e.g. 最小费用)为 f(x).我们的目标是求出 f(T)。找出 f(x)与哪些局面有关（记为 p），写出一个式子（称为状态转移方程），通过 f(p)来推出 f(x)
- DP 三连
  - 我是谁？ ——设计状态，表示局面
  - 我从哪里来？
  - 我要到哪里去？ ——设计转移

示例

0 - 1 背包问题(给定一组物品，每种物品都有自己的重量和价格，在限定的总重量内，我们如何选择，才能使得物品的总价格最高)

```js
/**
 * @param {*} w 物品重量
 * @param {*} v 物品价值
 * @param {*} C 总容量
 * @returns
 */
function knapsack(w, v, C) {
  let l = w.length
  let arr = Array(l).fill(Array(C + 1).fill(0))

  for (let j = 0; j <= C; j++) {
    if (w[0] <= j) {
      arr[0][j] = v[0]
    }
  }
  for (let i = 1; i < l; i++) {
    for (let j = 0; j <= C; j++) {
      if (w[i] <= j) {
        arr[i][j] = Math.max(arr[i - 1][j], arr[i - 1][j - w[i]] + v[i])
      } else {
        arr[i][j] = arr[i - 1][j]
      }
    }
  }
  return arr[l - 1][C]
}
```

最长递增子序列(在一组数字中，找出最长一串递增的数字)

```js
function lis(list) {
  if (list.length === 0) {
    return 0
  }
  let res = Array(list.length).fill(1)
  for (let i = 1; i < list.length; i++) {
    for (let j = 0; j < i; j++) {
      if (list[j] < list[i] && res[j] + 1 > res[i]) {
        res[i] = res[j] + 1
      }
    }
  }
  return Math.max(...res)
}
```
