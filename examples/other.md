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