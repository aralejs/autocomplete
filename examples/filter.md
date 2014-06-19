# 过滤器

- order:3

----

<script>
seajs.use('alice-select');
</script>

## 输出过滤

输出过滤将数据源的值通过一定规则过滤后输出，下面的规则为“匹配输入值在中间”

<input id="acTrigger1" type="text" value="" />

````javascript
seajs.use(['autocomplete', 'jquery'], function(AutoComplete, $) {
    new AutoComplete({
        trigger: '#acTrigger1',
        dataSource: ['abc', 'abd', 'abe', 'acd'],
        filter: function(data, query) {
            var result = [];
            if (!query) return result;
            $.each(data, function(index, item) {
                var value = item.value;
                if (new RegExp('\\w+'+query+'\\w+').test(value)) {
                    result.push(item);
                }
            });
            return result;
        },
        width: 150
    }).render();
});
````

## 全字符匹配

<input id="acTrigger3" type="text" value="" />

````javascript
seajs.use(['autocomplete', 'jquery'], function(AutoComplete, $) {
    new AutoComplete({
        trigger: '#acTrigger3',
        dataSource: ['abc abd', 'bcd tcd', 'cbdc abdc'],
        filter: 'stringMatch',
        width: 150
    }).render();
});
````
