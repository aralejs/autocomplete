# 基本操作

- order:1

----

<script>
</script>

最简单的方式只需要提供 trigger 和 datasource。

<input id="acTrigger1" type="text" value="" />

````javascript
require('../src/autocomplete.css');
var AutoComplete = require('arale-autocomplete');
new AutoComplete({
    trigger: '#acTrigger1',
    dataSource: ['abc', 'abd', 'abe', 'acd']
}).render();
````

## 阻止回车事件

当输入框在 form 中，直接回车会提交表单，这时需要设置 `submitOnEnter`

````html
<form name="" action="">
    <input id="acTrigger2" type="text" value="" />
</form>
````

````javascript
var AutoComplete = require('arale-autocomplete');
new AutoComplete({
    trigger: '#acTrigger2',
    submitOnEnter: false,
    dataSource: ['abc', 'abd', 'abe', 'acd']
}).render();
````

## 动态设置是否提示

可动态调用 `disabled` 属性

<input id="acTrigger3" type="text" value="" />

状态：<a href="#" id="acTrigger3-extra" data-status="on">开启</a>

````javascript
var AutoComplete = require('arale-autocomplete');
var $ = require('jquery');

var ac = new AutoComplete({
    trigger: '#acTrigger3',
    dataSource: ['abc', 'abd', 'abe', 'acd']
}).render();

$('#acTrigger3-extra').click(function(e) {
    e.preventDefault();
    var o = $(this), status = (o.html() === '开启');
    o.html(status? '关闭' : '开启')
    ac.set('disabled', status);
});
````



## 可以默认选中第一个

<input id="acTrigger5" type="text" value="" />

````javascript
var AutoComplete = require('arale-autocomplete');
new AutoComplete({
    trigger: '#acTrigger5',
    selectFirst: true,
    dataSource: ['abc', 'abd', 'abe', 'acd']
}).render();
````
