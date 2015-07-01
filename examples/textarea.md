# Textarea

- order:5

----

<style>
textarea {
    width: 500px;
    height: 200px;
}
</style>

<script>
</script>

输入 @ 可自动补全用户名

<form action="">
    <textarea id="acTrigger"></textarea>
</form>

<script type="text/x-handlebars" id="acTriggerTemplte">
<div class="{{classPrefix}}">
    <ul class="{{classPrefix}}-ctn" data-role="items">
        {{#each items}}
            <li data-role="item" class="{{../classPrefix}}-item" data-value="@{{value}} ">{{text}}</li>
        {{/each}}
    </ul>
</div>
</script>

````javascript
require('../src/autocomplete.css');

var TextareaComplete = require('../src/textarea-complete');
var $ = require('jquery');

new TextareaComplete({
    trigger: '#acTrigger',
    cursor: [15, 5],
    dataSource: [
      {nickName:'popomore', realName: 'Haoliang Gao'},
      {nickName:'lepture', realName: 'Hsaoming Yang'},
      {nickName:'afc163', realName: 'Xingmin Zhu'},
      {nickName:'shawn', realName: 'Shuai Shao'}
    ],
    submitOnEnter: false,
    selectFirst: true,
    template: $('#acTriggerTemplte').html(),
    inputFilter: function(q) {
        var m = q.match(/@[^@]*$/);
        return (m && m.length) ? m[0] : '';
    },
    filter: function(data, query) {
        var result = [], self = this;
        if (!query) return result;
        query = query.substring(1);
        var reg = new RegExp('^' + query);
        $.each(data, function(index, item) {
            if (reg.test(item.nickName) || reg.test(item.realName)) {
                result.push({
                    value: item.nickName,
                    text: item.nickName + ' (' + item.realName + ')'
                });
            }
        });
        return result;
    }
}).render();
````
