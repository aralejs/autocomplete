# 其他示例

- order:5

---

<script>
seajs.use('alice-select');
</script>

## Email 自动补全

这个功能很常用，在输入账号的时候希望补全常用的邮箱后缀

通过 dataSource 实现，每次输入 dataSource 都根据输入自动生成，并设置 filter 为空

<input id="example" type="text" value="" />

````javascript
seajs.use(['autocomplete', 'jquery'], function(AutoComplete, $) {
    var data = [
        '163.com',
        '126.com',
        'gmail.com'
    ];
    new AutoComplete({
        trigger: '#example',
        dataSource: function(query) {
            query = query.replace(/^(.*)@.*$/,'$1');
            return $.map(data, function(v) {
                return query + '@' + v;
            });
        }
    }).render();
});
````

## 选中后新开窗口

<form action="">
  <input id="acTrigger" type="text" value="" />
</form>

````javascript
seajs.use('select.css');
seajs.use(['autocomplete', './other.handlebars'], function(AutoComplete, template) {
  ac = new AutoComplete({
    trigger: '#acTrigger',
    template: template,
    width: '200',
    dataSource: [
      '信用卡',
      '信息 '
    ]
  }).render();
});
````
