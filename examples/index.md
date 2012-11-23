# 基本操作

- order:1

----

<script>
seajs.use('../src/autocomplete.css');
</script>

最简单的方式只需要提供 trigger 和 datasource。

<input id="acTrigger1" type="text" value="" />

````javascript
seajs.use('autocomplete', function(AutoComplete) {
    new AutoComplete({
        trigger: '#acTrigger1',
        dataSource: ['abc', 'abd', 'abe', 'acd']
    }).on('indexChange', function(currentIndex, lastIndex){
        console.log('currentIndex ' + currentIndex);
        console.log('lastIndex ' + lastIndex);
        console.log(this.items[currentIndex]);
    }).render();
});
````

## 阻止回车事件

当输入框在 form 中，直接回车会提交表单，这时需要设置 `submitOnEnter`

````html
<form name="" action="">
    <input id="acTrigger2" type="text" value="" />
</form>
````

````javascript
seajs.use('autocomplete', function(AutoComplete) {
    new AutoComplete({
        trigger: '#acTrigger2',
        submitOnEnter: false,
        dataSource: ['abc', 'abd', 'abe', 'acd']
    }).render();
});
````

## 动态设置是否提示

可动态调用 `disabled` 属性

<input id="acTrigger3" type="text" value="" />

状态：<a href="#" id="acTrigger3-extra" data-status="on">开启</a>

````javascript
seajs.use(['autocomplete', '$'], function(AutoComplete, $) {
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
});
````


## 自定义模板

默认的模板可以查看 `src/autocomplete.tpl`，如果有修改模板的操作可如下自己定义

````html
<script id="acTrigger4-template" type="text/x-handlebars-template">
  <div class="{{classPrefix}}">
    <input type="text" value="" class="{{classPrefix}}-input" style="margin:5px;">
    <ul class="{{classPrefix}}-ctn" data-role="items">
      {{#each items}}
        <li data-role="item" class="{{../classPrefix}}-item" data-value="{{value}}">{{highlightItem ../classPrefix}}</li>
      {{/each}}
    </ul>
  </div>
</script>
````

需要注意的：

1. `data-role` 必须指定
2. `highlightItem` 提供高亮功能，可不用
3. `classPrefix` 可根据需求指定，可自定义命名空间

使用该模板

<input id="acTrigger4" type="text" value="" />

````javascript
seajs.use(['autocomplete', '$'], function(AutoComplete, $) {
    var ac = new AutoComplete({
        trigger: '#acTrigger4',
        template: $('#acTrigger4-template').html(),
        dataSource: ['abc', 'abd', 'abe', 'acd']
    }).render();
});
````

## 可以默认选中第一个

<input id="acTrigger5" type="text" value="" />

````javascript
seajs.use('autocomplete', function(AutoComplete) {
    new AutoComplete({
        trigger: '#acTrigger5',
        selectFirst: true,
        dataSource: ['abc', 'abd', 'abe', 'acd']
    }).render();
});
````
