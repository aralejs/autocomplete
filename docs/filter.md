# 过滤器 Filter

- order: 3

----

过滤器用于筛选 dataSource，最后输出给模板进行渲染。

## 使用方式

实例化的时候 filter 参数支持三种方式：

 -  不传参或值为 null、false

    这种请看默认使用 `startsWith`。

    **注意：如果 `dataSource` 为 url，使用 default，一般异步场景不需要 filter** 

 -  字符串

    可指定[内置的 filter](#内置的过滤器)，如找不到则用 default。


 -  函数

    通过自定义函数去筛选 dataSource，要注意数据转换。

    如：筛选出包含输入值的数据

    ```
    filter: function(data, query) {
      var result = [];
      $.each(data, function(index, item) {
        if (item.value.indexOf(query) > -1) {
          result.push({matchKey: value});
        }
      });
      return result;
    }
    ```

## 内置的过滤器

### default

不做任何处理，按原样输出

### startsWith

从头开始全匹配输入的值，示例

```
[
  'abc',
  'abd',
  'bcd'
]
```

输入 a 匹配 abc abd；输入 abc 匹配 abc。

### stringMatch

全局匹配字符串，只要有匹配到就会返回，示例

```
[
  'abc',
  'abd',
  'bcd'
]
```

输入 b 全部匹配；输入 c 匹配 abc bcd。

## 自定义过滤器

每个过滤器接受两个参数，最后返回一个数组

1. data: dataSource 的返回值
2. query: 输入后的值

### filter 中的数据转换

过滤器处理的数据类型为数组，也就是说输入和输出都为数组。

输入的数组是符合 [dataSource 数据格式](http://aralejs.org/autocomplete/#datasource-array-object-string-function)的。

输出的对象也该保持一样的数据格式，如果想使用 highlightItem 的话，需要提供 highlightIndex。

这个属性是为了增加高亮被匹配值的配置，渲染模版时会增加 `item-hl` 样式。

highlightIndex 为一个二位数组，确定被匹配字符的位置。描述了多个高亮元素的索引值，aba 中第一个 a 的索引值为 [0, 1]，第二个 a 的索引值为 [2, 3]。

```
{value: 'aba', highlightIndex:[[0, 1], [2, 3]]}
```

在 DOM 上的表现

```
<span class="item-hl">a<span>b<span class="item-hl">c<span>
```

示例：

```
// 输入
[
  {value: 'aba'},
  {value: 'abb'},
  {value: 'abc'}
]

// 输出
[
  {value: 'aba', highlightIndex:[[0, 1], [2, 3]]},
  {value: 'abb', highlightIndex:[[0, 1]]},
  {value: 'abc', highlightIndex:[[0, 1]]}
]
```
