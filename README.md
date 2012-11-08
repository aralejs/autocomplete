# AutoComplete

---

自动补全组件。

---

## 使用说明

初始化 autocomplete

```javascript
ac = new AutoComplete({
    trigger: '#test',
    dataSource: ['abc', 'abd', 'cbd']
}).render();
```

## API

### 属性 

#### trigger *selector*

输入框

#### template *string*

模版，注意覆盖的时候不要缺少 `data-role`

模板重新渲染的时候只会渲染 `data-role="items"` 下面的

#### classPrefix *string*

样式前缀，默认为 `ui-autocomplete`


#### dataSource *array | object | string | function*

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

    提供一个 URL，jsonp 的方式返回数据，返回的数据也可以通过 `resultsLocator` 找。
    
    URL 提供一个模版参数 `./test.json?v={{query}}`，query 是输入后过滤的值。

1.  Function

    提供一个自定义函数，根据自己的业务逻辑返回数组，这个自定义程度很高，可实现上面 3 中方式。
    
    可以每次输入都动态生成数据，如邮箱自动补完
    
    ```
    dataSource: function(value) {
        return [
            value + '@gmail.com',
            value + '@qq.com',
            value + '@163.com'
        ];
    }
    ```
    
    也可以自己发送请求获取数据，return false 可阻止 data 事件，可查看 [dataSource](./docs/data-source.html)
    
    ```
    dataSource: function(value) {
        var that = this;
        $.ajax('test.json?v+' + value, {
            dataType: 'jsonp'
        }).success(function(data) {
            that.trigger('data', data);
        })
        return false;
    }
    ```

#### locator *object | function*

这个参数跟 dataSource 相关，一般情况 dataSource 会返回一个数组，filter 可以直接处理。但如果返回的是 Object，那么就需要找到这个需要的那个数组。

这个参数可定位到需要的值，支持两种方式

1.  字符串，默认为 'data'。如果为空字符串则返回原来的值。

    ```
    {
        data: ['10010', '10086', '10000']
    }
    ```
    
    指定 `locator: 'data'`，最终给 filter 的为 `['10010', '10086', '10000']`
    
    还支持多层定位，如下可用 `locator: 'a.b'`
    
    ```
    {a : {b: [1, 2]}}
    ```

2.  自定义函数

    ```
    locator : function(data) {
        // find data and return
    }
    ```
    

#### filter *function*

输出值的过滤器，用于筛选 dataSource，默认方法为 `startsWith`，具体方法可以查看 [Filter](./docs/filter.html)

**过滤器支持类型**

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


**filter 中的数据转换**

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

#### inputFilter *function*

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

#### submitOnEnter *boolean*

回车时是否提交表单，默认为 true，会提交表单，组件不做任何处理。

### 事件

#### itemSelect

当选中某项时触发，value 为当前选中的值。

```
.on('itemSelect', function(value){
    // code
});
```

#### indexChange

当选项切换时触发，可能是鼠标或键盘，index 为切换后的索引值。

```
.on('indexChange', function(index){
    // code
});
```
