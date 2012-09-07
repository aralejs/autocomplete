# AutoComplete

自动补全组件

---

## 使用说明

                        

                        
## 属性 

### trigger

输入框

### template

模版，注意覆盖的时候不要缺少 `data-role`

### classPrefix 

样式前缀，默认为 `ui-autocomplete`


### dataSource

提供的数据源，需要以数组的形式，以这个为基准进行筛选

共支持 4 种方式

1.  Array

    提供一个简单的字符串数组
   
    ```
    ['10010', '10086', '10000']
    ```


1.  Object

    提供一个对象，里面要包含数组，可以通过 `resultsLocator` 找到
    
    ```
    {
        data: ['10010', '10086', '10000']
    }
    ```


1.  URL

    提供一个 URL，jsonp 的方式返回数据。也可以通过 `resultsLocator` 找
    
    URL 提供一个模版参数 `./test.json?v={{query}}`，query 是输入后过滤的值。

1.  Function

### resultsLocator



### filter

输出值的过滤器，用于筛选 dataSource，默认方法为 `startsWith`，具体方法可以查看 [Filter](./docs/filter.html)

#### 过滤器支持类型

-   默认值(startsWith)，不设置此属性
  
    会调用默认的 startsWith 方法，从头开始匹配

-   空字符串、null、undefined、false

    什么都不处理，返回原来的 dataSource
  
-   函数

    通过自定义函数去去筛选 dataSource，要注意数据转换。
  
    如：筛选出包含输入值的数据
  
    ```
    filter: function(data, query) {
        var result = [];
        $.each(data, function(index, value) {
            if (value.indexOf(query) > -1) {
            result.push({value: value});
            }
        });
        return result;
    }
    ```


#### filter 中的数据转换

做这个数据转换主要是为了增加高亮值的配置，渲染模版时会增加 `item-hl` 样式，如下是匹配所有的 a

```
// 输入
['aba', 'abb', 'abc']

// 输出
[
  {value: 'aba', highlightIndex:[[0, 1], [2, 3]]},
  {value: 'abb', highlightIndex:[[0, 1]]},
  {value: 'abc', highlightIndex:[[0, 1]]},
]
```
highlightIndex 描述了多个高亮元素的索引值，aba 中第一个 a 的索引值为 [0, 1]，第二个 a 的索引值为 [2, 3]。


想了解更多可查看[设计章节](./docs/design.html)

### inputFilter

输入值的过滤器，支持 Function，默认不做处理。

这个参数可以过滤输入框中的值，过滤后的匹配值用于筛选数据。

如果用户输入 a@alipay，但我想用 @ 前面的值去筛选可以如下处理

```
new AutoComplete({
    inputFilter: function(value) {
        return value.split('@')[0];
    }
})
```



### submitOnEnter

回车时是否提交表单，默认为 true，会提交表单，组件不做任何处理。

## 事件

### itemSelect

### inputChange
