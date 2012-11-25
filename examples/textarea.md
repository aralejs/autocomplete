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
seajs.use('../src/autocomplete.css');
</script>

输入 @ 可自动补全用户名

<form action="">
    <textarea id="acTrigger"></textarea>
</form>

<script type="text/x-handlebars" id="acTriggerTemplte">
<div class="{{classPrefix}}">
    <ul class="{{classPrefix}}-ctn" data-role="items">
        {{#each items}}
            <li data-role="item" class="{{../classPrefix}}-item" data-value="{{value}}">{{text}}</li>
        {{/each}}
    </ul>
</div>
</script>

````javascript
seajs.use(['autocomplete', '$'], function(AutoComplete, $) {
    new AutoComplete({
        trigger: '#acTrigger',
        dataSource: ['abc', 'abd', 'abe', 'acd'],
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
                if (!query) {
                    result.push({
                        value: self.get('inputValue').replace(/@[^@]*$/, '') + '@' + item,
                        text: item
                    });
                } else if (reg.test(item)) {
                    result.push({
                        value: self.get('inputValue').replace(/@[^@]*$/, '') + '@' + item,
                        text: item
                    });
                }
            });
            return result;
        }
    }).render();
});
````
