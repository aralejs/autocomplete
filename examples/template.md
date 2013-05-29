# 自定义模板

- order:6

----

<script>
seajs.use('../src/autocomplete.css');
</script>

## 自定义模板

默认的模板可以查看 `src/autocomplete.tpl`，如果有修改模板的操作可如下自己定义

````html
<script id="acTrigger4-template" type="text/x-handlebars-template">
  <div class="{{classPrefix}}">
    <input type="text" value="" class="{{classPrefix}}-input" style="margin:5px;">
    
    <ul class="{{classPrefix}}-ctn" data-role="items">
      {{#if items}}
      {{#each items}}
        <li data-role="item" class="{{../classPrefix}}-item" data-value="{{matchKey}}">{{matchKey}}</li>
      {{/each}}
      {{/if}}
      {{#unless items}}
        <li class="{{classPrefix}}-item">不存在</li>
      {{/unless}}
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