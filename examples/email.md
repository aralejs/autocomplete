# Email 自动补全

- order:4

---

这个功能很常用，在输入账号的时候希望补全常用的邮箱后缀

通过 dataSource 实现，每次输入 dataSource 都根据输入自动生成，并设置 filter 为空

<input id="example" type="text" value="" />

````javascript
var AutoComplete = require('arale-autocomplete');
var $ = require('jquery');

var data = [
    '163.com',
    '126.com',
    'gmail.com'
];
new AutoComplete({
    trigger: '#example',
    dataSource: function(query) {
        var a = $.map(data, function(v, i) {
            return query + '@' + v;
        });
        return a;
    },
    filter: '',
    inputFilter: function(v){
        return v.replace(/^(.*)@.*$/,'$1');
    }
}).render();
````

