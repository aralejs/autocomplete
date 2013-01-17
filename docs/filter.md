# 过滤器 Filter

- order: 3

----

过滤器接受数据源和输入的值，最后输出给模板进行渲染

## 使用方式

直接指定使用

```
filter: 'startsWith'
```

## 内置的过滤器

### default

按原样输出，指定 `filter = ''` 会调用这个过滤器。

### startsWith

从头开始全匹配输入的值

支持参数：

 -  key: 如果是对象数组，key 为需要过滤的那个字段，默认值为 `value`。

示例：提供 dataSource

```
[
  {title: 'abc'},
  {title: 'abd'},
  {title: 'bcd'}
]
```

输入 `a` 后显示 abc 和 abd，进行如下设置

```
filter: {
    name: 'startsWith',
    options: {
        key: 'title'
    }
}
```

### stringMatch

全局匹配字符串，只要有匹配到就会返回

支持参数：

 -  key: 如果是对象数组，key 为需要过滤的那个字段，默认值为 `value`。

示例：提供 dataSource

```
[
  {title: 'abc'},
  {title: 'abd'},
  {title: 'bcd'}
]
```

输入 `c` 后显示 abc 和 bcd，进行如下设置

```
filter: {
    name: 'stringMatch',
    options: {
        key: 'title'
    }
}
```

## 自定义

提供三个参数

1. data: dataSource 的返回值
2. query: input 过滤后的返回值
3. options: 自定义属性

返回结果也要是一个数组，但结构有变化。

### filter 中的数据转换

过滤器的输入（也就是数据源的输出）支持两个类型：字符串数组和对象数组，最终 filter 输出的仅为对象数组。

输出的对象需要提供：

 -  matchKey

    被匹配的值，最后显示的内容。如果是字符串则取本身，如果是对象通过 options/key 来指定那个属性为 matchKey。

 -  highlightIndex

    这个属性是为了增加高亮被匹配值的配置，渲染模版时会增加 `item-hl` 样式。

    highlightIndex 为一个二位数组，确定被匹配字符的位置。描述了多个高亮元素的索引值，aba 中第一个 a 的索引值为 [0, 1]，第二个 a 的索引值为 [2, 3]。

    ```
    {matchKey: 'aba', highlightIndex:[[0, 1], [2, 3]]}
    ```

    ```
    <span class="item-hl">a<span>b<span class="item-hl">c<span>
    ```

示例：

```
// 输入
['aba', 'abb', 'abc']

// 输出
[
  {matchKey: 'aba', highlightIndex:[[0, 1], [2, 3]]},
  {matchKey: 'abb', highlightIndex:[[0, 1]]},
  {matchKey: 'abc', highlightIndex:[[0, 1]]},
]
```
