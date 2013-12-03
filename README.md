# AutoComplete 

- order: 1

---

[![Build Status](https://secure.travis-ci.org/aralejs/autocomplete.png?branch=master)](https://travis-ci.org/aralejs/autocomplete)
[![Coverage Status](https://coveralls.io/repos/aralejs/autocomplete/badge.png?branch=master)](https://coveralls.io/r/aralejs/autocomplete)

自动补全组件。

---

AutoComplete 继承自 [overlay](http://aralejs.org/overlay/)，可使用其中包括 [widget](http://aralejs.org/widget/)、[base](http://aralejs.org/base/)、[class](http://aralejs.org/class/)、[events](http://aralejs.org/events/)、[attribute](http://aralejs.org/base/docs/attribute.html)、[aspect](http://aralejs.org/base/docs/aspect.html) 的属性和方法。

## 使用说明

初始化 autocomplete

```javascript
ac = new AutoComplete({
    trigger: '#test',
    dataSource: ['abc', 'abd', 'cbd']
}).render();
```

再稍微复杂一点可以通过数据控制显示，dataSource 可以是一个数据集，格式为

```
dataSource: [
  {value: 'shanghai', label: '上海', alias: ['sh']},
  {value: 'beijing', label: '北京', alias: ['bj']}
]
```

组件通过 value 和 alias 进行过滤，而最后显示的是 label 的数据，选中后输入框的也是 label 数据。这三个字段为保留字段，其他字段可以自己定义，还可以定义模板去修改显示，[查看演示](http://aralejs.org/autocomplete/examples/template.html#使用参数来自定义模板)。

在看 API 之前查看[更多演示](http://aralejs.org/autocomplete/examples/)

## API

### Attribute

#### trigger *selector*

指定输入框

#### template *string*

默认模板请[查看源码](https://github.com/aralejs/autocomplete/blob/master/src/autocomplete.handlebars)

**注意覆盖的时候不要缺少 `data-role`**，查看[如何自定义 template 的演示](http://aralejs.org/autocomplete/examples/template.html)，简单的场景可以使用下面几项。

### header *string*

自定义模板头部，默认为空。

### html *string*

自定义每项，默认是 {{label}}。

### footer *string*

自定义模板尾部，默认为空。

#### classPrefix *string*

样式前缀，默认为 `ui-select`

#### dataSource *array | object | string | function*

最终提供给 filter 的数据是一个数组，数组内的每项为一个对象，value、label 和 alias 为保留字段。

```
[
  {value: '', label: '', alias: []},
  ...
]
```

如果传入的为字符串 ['a']，会自动转化成 [{value: 'a', label: 'a'}]。

数据源支持4种形式

1.  Array

    直接提供一个数组，无需转换
   
    ```
    ['10010', '10086', '10000']
    ```


2.  Object

    提供一个对象，里面要包含数组，可以通过 `locator: 'data'` 指定这个数组
    
    ```
    {
        data: ['10010', '10086', '10000']
    }
    ```


3.  URL

    提供一个 URL，通过 ajax 返回数据，返回的数据也可以通过 `locator` 查找。
    
    URL 提供模版参数 `./test.json?v={{query}}&t={{timestamp}}`，query 是输入的值，timestamp 为时间戳。

    如果 URL 为 http 或 https 开头，会用 jsonp 发送请求，否则为 ajax。

4.  Function

    提供一个自定义函数，根据自己的业务逻辑返回数组，这个自定义程度很高，可实现上面 3 种方式。
    
    可以每次输入都动态生成数据，如邮箱自动补完
    
    ```
    dataSource: function(query) {
      return [
        query + '@gmail.com',
        query + '@qq.com',
        query + '@163.com'
      ];
    }
    ```
    
    也可以自己发送请求获取数据，`return false` 阻止同步返回，使用 `done` 异步返回数据。
    
    ```
    dataSource: function(query, done) {
        var that = this;
        $.ajax('test.json?v=' + query, {
            dataType: 'jsonp'
        }).success(function(data) {
            done(data);
        })
        return false;
    }
    ```

#### locator *object | function*

这个参数与 dataSource 相关，一般情况 dataSource 为一个数组，filter 可以直接处理。但如果返回的是 Object，那么就需要指定那个数组。

这个参数可定位到需要的值，支持两种方式

1.  字符串，默认为 `data`。**如果为空字符串则返回原来的值**。

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

过滤器用于筛选 dataSource，最后输出给模板进行渲染，默认方法为 `startsWith`。

使用方式可查看[过滤器章节](http://aralejs.org/autocomplete/docs/filter.html)。

#### submitOnEnter *boolean*

回车时是否提交表单，默认为 true，会提交表单，组件不做任何处理。

#### disabled *boolean*

是否禁用，默认为 `false`

#### selectFirst *boolean*

默认选中第一项

#### delay *number*

按键频率，每次按键的间隔，在这个时间范围内不会处理过滤流程。

### 方法

#### selectItem

选中某项

```
.selectItem(0)
```

选中第一项，如果没有参数，选中当前 selectedIndex 那项。

#### setInputValue

通过 api 模拟输入框输入，输入 a

```
.setInputValue('a')
```

### Properties

#### input

输入框的实例，`this.input`，查看[文档](http://aralejs.org/autocomplete/docs/input.html)

#### dataSource

数据源的实例，`this.dataSource`，查看[文档](http://aralejs.org/autocomplete/docs/data-source.html)

#### items

下拉框的选项，`this.items`，等同于 `this.$('[data-role=items]').children()`。

### 事件

#### itemSelected

当选中某项时触发
 
 - data：选中项对应的数据源对象
 - item：选中项对应的 DOM

```
.on('itemSelected', function(data, item){
    console.log(data.label);
});
```

#### indexChanged

当选项切换时触发，可能是鼠标或键盘。

 -  currentIndex: 切换后的索引值

 -  previousIndex: 切换前的索引值

```
.on('indexChanged', function(current, prev){
    console.log(this.items[current])
});
```


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/aralejs/autocomplete/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

