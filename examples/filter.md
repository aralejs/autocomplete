# 过滤器

- order:3

----

<script>
seajs.use('../src/autocomplete.css');
</script>

## 输出过滤

输出过滤将数据源的值通过一定规则过滤后输出，下面的规则为“只要包涵输入值”

<input id="acTrigger1" type="text" value="" />

````javascript
seajs.use(['autocomplete', '$'], function(AutoComplete, $) {
    new AutoComplete({
        trigger: '#acTrigger1',
        dataSource: ['abc', 'abd', 'abe', 'acd'],
        filter: function(data, query) {
            var result = [];
            $.each(data, function(index, value) {
                if (value.indexOf(query) > -1) {
                    result.push({matchKey: value});
                }
            });
            return result;
        }
    }).render();
});
````

## 输入过滤

输入过滤将输入框的值过滤，某些情况不想取整个输入框的值，只想去一部分。

如 email 只想通过 @ 前的值进行筛选

<input id="acTrigger2" type="text" value="a@gmail.com" />

````javascript
seajs.use(['autocomplete', '$'], function(AutoComplete, $) {
    new AutoComplete({
        trigger: '#acTrigger2',
        dataSource: [
            'abc@gmail.com',
            'abd@gmail.com',
            'abe@gmail.com',
            'acd@gmail.com'
        ],
        inputFilter: function(value) {
            return value.split('@')[0];
        }
    }).render();
});
````

## 全字符匹配

<input id="acTrigger3" type="text" value="" />

````javascript
seajs.use(['autocomplete', '$'], function(AutoComplete, $) {
    new AutoComplete({
        trigger: '#acTrigger3',
        dataSource: ['abc abd', 'bcd tcd', 'cbdc abdc'],
        filter: 'stringMatch'
    }).render();
});
````
