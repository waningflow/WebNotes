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
