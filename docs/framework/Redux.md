# Redux

## 源码分析

- combineReducers 函数,接收一个对象，将参数过滤后返回一个函数。该函数里有一个过滤参数后的对象 finalReducers，遍历该对象，然后执行对象中的每一个 reducer 函数，最后将新的 state 返回
  - assertReducerShape 函数，检查初始化的值是否为 undefined
  - getUnexpectedStateShapeWarningMessage 函数，检查一些错误

*TBD*
