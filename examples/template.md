# 自定义模板

- order:4

----

<script>
seajs.use('select');
</script>

## 使用参数来自定义模板

<input id="acTrigger1" type="text" value="" />

<style>
.ui-select-item a {padding: 7px 10px 7px 0;}
.ui-select-item a span {float: right; color: #ccc;}
.ui-select-header, .ui-select-footer {padding: 3px 10px; font-size: 12px;}
.ui-select-footer {text-align: right;}
</style>

````javascript
seajs.use(['autocomplete', '$'], function(AutoComplete, $) {
    var ac = new AutoComplete({
        trigger: '#acTrigger1',
        header: '<div class="{{classPrefix}}-header">筛选省市：</div>',
        footer: '<div class="{{classPrefix}}-footer">搜索 {{query}} 的{{length}}个结果</div>',
        html: '<strong>{{city}}</strong><span>{{prov}}</span>',
        dataSource: [
          {city: '上海', prov: '上海', label: '上海', value: 'shanghai', alias: ['上海']},
          {city: '苏州', prov: '江苏', label: '苏州', value: 'suzhou', alias: ['苏州']},
          {city: '深圳', prov: '广州', label: '深圳', value: 'shenzhen', alias: ['深圳']},
          {city: '沈阳', prov: '辽宁', label: '沈阳', value: 'shenyang', alias: ['沈阳']}
        ],
        width: 150
    }).render();

    ac.element.on('click', '#xxx', function() {
      //alert(1);
    })
});
````

## 自定义整个模板

默认的模板可以查看 `src/autocomplete.handlebars`，如果有修改模板的操作可如下自己定义

````html
<script id="acTrigger4-template" type="text/x-handlebars-template">
  <div class="{{classPrefix}}">    
    {{#if items}}
    <ul class="{{classPrefix}}-content" data-role="items">
      {{#each items}}
      <li data-role="item" class="{{../classPrefix}}-item"><a href="javascript:''">{{> html}}</a></li>
      {{/each}}
    </ul>
    {{else}}
    没有匹配任何数据
    {{/if}}
  </div>
</script>
````

当未匹配的时候会有提示

<input id="acTrigger4" type="text" value="" />

````javascript
seajs.use(['autocomplete', '$'], function(AutoComplete, $) {
    var AutoCompleteX = AutoComplete.extend({
        _isEmpty: function() {
          return false;
        }
    });
    var ac = new AutoCompleteX({
        trigger: '#acTrigger4',
        template: $('#acTrigger4-template').html(),
        dataSource: ['abc', 'abd', 'abe', 'acd'],
        width: 150
    }).render();
});
````