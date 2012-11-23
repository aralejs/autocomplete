# AutoComplete 

- order: 1

---

[![Build Status](https://secure.travis-ci.org/aralejs/autocomplete.png)](https://travis-ci.org/aralejs/autocomplete)

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

在看 API 之前查看[更多演示](./examples/)

## API

### 属性 

#### trigger *selector*

输入框

#### template *string*

默认模板

```html
<div class="{{classPrefix}}">
    <ul class="{{classPrefix}}-ctn" data-role="items">
        {{#each items}}
            <li data-role="item" class="{{../classPrefix}}-item" data-value="{{matchKey}}">{{highlightItem ../classPrefix matchKey}}</li>
        {{/each}}
    </ul>
</div>
```

 -  注意覆盖的时候不要缺少 `data-role`

 -  模板重新渲染的时候只会渲染 `data-role="items"` 下面的

 -  highlightItem 会高亮匹配的值，接受两个参数 `classPrefix` 和 `需要高亮的值`，这个方法会通过对象的 highlightIndex 读取高亮的位置，具体格式看 filter

#### classPrefix *string*

样式前缀，默认为 `ui-autocomplete`

#### dataSource *array | object | string | function*

最终提供给 filter 的数据是一个数组，数组内的每项可为字符串或对象

```
[
    {title: 'abc'},
    {title: 'abd'}
]
```

或

```
[
    'abc',
    'abd'
]

```

数据源通过转化变成这种形式，共支持 4 种方式

1.  Array

    直接提供一个数组，无需转换
   
    ```
    ['10010', '10086', '10000']
    ```


1.  Object

    提供一个对象，里面要包含数组，可以通过 `locator` 找到
    
    ```
    {
        data: ['10010', '10086', '10000']
    }
    ```


1.  URL _(0.9.0+ 支持 ajax)_

    提供一个 URL，通过 ajax 返回数据，返回的数据也可以通过 `locator` 查找。
    
    URL 提供一个模版参数 `./test.json?v={{query}}`，query 是输入的值，如果使用了 `inputFilter` 则是过滤后的值。

    如果 URL 为 http 或 https 开头，会用 jsonp 发送请求。

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
    
    也可以自己发送请求获取数据，`return false` 可阻止 data 事件，可查看 [dataSource](./docs/data-source.html)
    
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

这个参数跟 dataSource 相关，一般情况 dataSource 为一个数组，filter 可以直接处理。但如果返回的是 Object，那么就需要找到那个数组。

这个参数可定位到需要的值，支持两种方式

1.  字符串，默认为 `data`。如果为空字符串则返回原来的值。

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

输出值的过滤器，用于筛选 dataSource，默认方法为 `startsWith`。

**过滤器支持类型**

 -  字符串

    可指定内置的 filter，查看[过滤器章节](./docs/filter.html)。
 
    如不设置此属性会调用默认的 `startsWith` 方法，从头开始匹配

 -  对象 _(0.9.0+)_

    过滤器可支持参数，具体参数(options)由过滤器自身决定。

    ```
    filter: {
        name: 'startsWith',
        options: {
            param: 1
        }
    }
    ```

    `filter: {name: 'startsWith'}` 等于 `filter: 'startsWith'`

 -  空字符串、null、undefined、false

    什么都不处理，返回原来的 dataSource

    _(0.9.0+ 支持)_ **注意：如果 `dataSource` 为 url，默认值为空，一般异步场景不需要 filter** 

 -  函数

    通过自定义函数去去筛选 dataSource，要注意数据转换。

    如：筛选出包含输入值的数据

    ```
    filter: function(data, query) {
        var result = [];
        $.each(data, function(index, value) {
            if (value.indexOf(query) > -1) {
            result.push({matchKey: value});
            }
        });
        return result;
    }
    ```

想了解更多可查看[过滤器章节](./docs/filter.html)和[设计章节](./docs/design.html)

#### inputFilter *function*

输入值的过滤器，支持 Function，默认不做处理。

这个参数可以过滤输入框中的值，过滤后的匹配值用于筛选数据。

如果用户输入 a@alipay，但想用 @ 前面的值去筛选可以如下处理

```
new AutoComplete({
    inputFilter: function(value) {
        return value.split('@')[0];
    }
})
```

#### submitOnEnter *boolean*

回车时是否提交表单，默认为 true，会提交表单，组件不做任何处理。

#### disabled *boolean* _(0.9.0+)_

是否禁用，默认为 `false`

#### selectFirst *boolean* _(0.9.0+)_

默认选中第一项

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
