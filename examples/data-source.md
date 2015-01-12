# 数据源

- order:2

---

<script>
seajs.use('alice-select');
</script>

在使用前先看下数据源的文档

## 使用对象

数据源通常为数组，但也可以为对象，如果是对象默认会去找对象的 data 属性。

在每次输入的时候都会调用下 dataSource

<input id="acTrigger1" type="text" value="" />

````javascript
seajs.use('autocomplete', function(AutoComplete) {
    new AutoComplete({
        trigger: '#acTrigger1',
        dataSource: {
            data: ['abc', 'abd', 'abe', 'acd']
        },
        width: 150
    }).render();
});
````

## 使用异步数据

一般异步获取后的数据不需要过滤了，可设置 `filter` 为空

<input id="acTrigger2" type="text" value="" />

````javascript
seajs.use('autocomplete', function(AutoComplete) {
    new AutoComplete({
        trigger: '#acTrigger2',
        dataSource: './data.json?q={{query}}&nowrap',
        width: 150
    }).render();
});
````

## 自定义数据源

可以把本地数据和异步数据结合起来

<input id="acTrigger3" type="text" value="" />

````javascript
seajs.use(['autocomplete', 'jquery'], function(AutoComplete, $) {
    var local = ['ade', 'adf'];
    new AutoComplete({
        trigger: '#acTrigger3',
        dataSource: function(value, done) {
            var that = this;
            $.ajax('./data.json?nowrap', {
                dataType: 'json'
            })
            .success(function(data) {
                done(data.concat(local));
            })
            .error(done);
        },
        width: 150
    }).render();
});
````

## 处理嵌套结构

如果数据结构很复杂，你可以通过 `locator` 找到你要的数据

<input id="acTrigger4" type="text" value="" />

````javascript
seajs.use(['autocomplete', 'jquery'], function(AutoComplete, $) {
    new AutoComplete({
        trigger: '#acTrigger4',
        locator: 'my.mother.father.brothers',
        dataSource: {
            my: {
                mother: {
                    father: {
                        brothers: [
                            'abc',
                            'abd',
                            'abe',
                            'acd'
                        ]
                    }
                }
            }
        },
        width: 150
    }).render();
});
````

## 处理复杂数据结构

数据不是字符串而是复杂结构

<input id="acTrigger5" type="text" value="" />

````javascript
seajs.use(['autocomplete', 'jquery'], function(AutoComplete, $) {
    new AutoComplete({
        trigger: '#acTrigger5',
        dataSource: [
          {value: 'abc', myprop: '123'},
          {value: 'abd', myprop: '124'},
          {value: 'abe', myprop: '125'},
          {value: 'acd', myprop: '134'}
        ],
        width: 150
    }).render();
});
````

## 单独指定最终表单值

利用复杂结构，可以指定与选项文本不同的值作为最终表单值。

在下面的示例中，数据项的 `value` 属性用来匹配，
`label` 属性用于选项展示，`target` 作为最终用来提交的表单值。

<input id="acTrigger6" type="text" value="" />

````javascript
seajs.use(['autocomplete', 'jquery'], function(AutoComplete, $) {
    new AutoComplete({
        trigger: '#acTrigger6',
        filter: 'stringMatch',
        dataSource: [
            {
                value: '天弘增利宝货币 000198 TIANHONGZENGLIBAO',
                label: '天弘增利宝货币 000198',
                target: '000198'
            },
            {
                value: '交银21天 519716 JYLC21TZQA',
                label: '交银21天 519716',
                target: '519716'
            },
            {
                value: '招商理财7天B 217026 ZSLC7TZQB',
                label: '招商理财7天B 217026',
                target: '217026'
            }
        ],
        width: 200
    }).render();
});
````
