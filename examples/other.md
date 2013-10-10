# 其他

---

## 选中后新开窗口

<form action="">
  <input id="acTrigger" type="text" value="" />
</form>

````javascript
seajs.use('../src/autocomplete.css');
seajs.use(['autocomplete', './other.handlebars'], function(AutoComplete, template) {
  ac = new AutoComplete({
    trigger: '#acTrigger',
    template: template,
    selectItem: false,
    dataSource: [
      '信用卡',
      '信息 '
    ]
  }).render();
});
````

## 下拉框高度固定, 出现滚动条时, 键盘上下选中项时跟随

<input id="scroll" type="text" value="" />

````javascript
seajs.use('autocomplete', function(AutoComplete) {
    new AutoComplete({
        trigger: '#scroll',
        dataSource: ['abc', 'abd', 'abe', 'acd', 'ace', 'acf', 'acg', 'ach', 'aci', 'acj', 'ack'],
        style: {
            'overflow': 'scroll'
        },
        height: 120
    }).render();
});
````