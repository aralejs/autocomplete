# History

---

## 1.3.1

`tag:fixed` 修复 for/in 数组的 bug

`tag:fixed` #98 模板中不应该使用 javascript:\'\'

## 1.3.0

`tag:changed` 大范围的重构，很多细节有变化，可以按照新文档开发。

## 1.2.3

`tag:fixed` [#82](https://github.com/aralejs/autocomplete/issues/82) 当浮层设置高度, 出现滚动条时, 按上下键选中项需要在可视范围内

`tag:fixed` 页面上多个 textarea-complete 时, 修复 mirror 的引用 bug

## 1.2.2

`tag:improved` 升级 base 到 1.1.1, templatable 到 0.9.1, overlay 到 1.1.1

## 1.2.1

`tag:changed` 模板 highLightItem 需要使用 `{{{}}}`，否则会被转义

`tag:improved` 升级 handlebars 为 1.0.2 , 升级 base 为 1.1.0,
升级 templateable 为 0.9.0, 升级 overlay 为 1.1.0

`tag:fixed` #72 修复输入特殊字符报错的问题

## 1.2.0

`tag:new` [#48](https://github.com/aralejs/autocomplete/issues/48) filter 增加 stringMatch

`tag:fixed` [#56](https://github.com/aralejs/autocomplete/issues/56) 修复 startsWith 特殊字符报错的情况

`tag:improved` [#55](https://github.com/aralejs/autocomplete/issues/55) 鼠标 hover 的时候 selectedIndex 不变化

## 1.1.1

`tag:fixed` 修复输入相同值不显示的问题, 看[用例](http://aralejs.org/autocomplete/tests/runner.html?grep=Autocomplete%20should%20show%20when%20same%20value)

## 1.1.0 [milestone](https://github.com/aralejs/autocomplete/issues?milestone=4&state=closed)

`tag:new` [#45](https://github.com/aralejs/autocomplete/issues/45) dataSource 新增 abort 接口，可以阻止异步请求

`tag:changed` dataSource 类型为 function 时，异步返回由 `this.trigger('data', data)` 改为 `done(data)`。

`tag:changed` 如果 inputFilter 过滤后的值没有变化也不做处理

`tag:improved` [#47](https://github.com/aralejs/autocomplete/issues/47) 返回数据为空仍然显示，`data-role=items` 内容为空才隐藏

`tag:improved` [#52](https://github.com/aralejs/autocomplete/issues/52) dataSource ajax 请求添加时间戳模板，url 可以写 `q={{query}&t={{timestamp}}`

`tag:fixed` 修复Enter 也会触发 keyup 的问题

## 1.0.0 [milestone](https://github.com/aralejs/autocomplete/issues?milestone=3&state=closed)

`tag:new` [#37](https://github.com/aralejs/autocomplete/issues/37) 拆分出 textarea-complete，单独支持 textarea。

`tag:new` [#25](https://github.com/aralejs/autocomplete/issues/25) 提供 setInputValue 方法程序可以自动补完

`tag:new` [#41](https://github.com/aralejs/autocomplete/issues/41) 提供 delay 属性

`tag:changed` [#31](https://github.com/aralejs/autocomplete/issues/31) itemSelect 事件接口变更

`tag:improved` 输入频率从 300 到 100，没有明显停顿

`tag:improved` [#25](https://github.com/aralejs/autocomplete/issues/25) filter 处理优化

`tag:improved` 提取 _step 方法处理 index 变化

`tag:improved` [#26](https://github.com/aralejs/autocomplete/issues/26) focus/blur 优化

`tag:fixed` [#32](https://github.com/aralejs/autocomplete/issues/32) 选中某项后 focus 输入框

`tag:fixed` [#42](https://github.com/aralejs/autocomplete/issues/42) 修复回车后还是会触发 keyup 的问题

`tag:fixed` [#39](https://github.com/aralejs/autocomplete/issues/39) 修复 dataSource url 的参数没有编码的问题

## 0.9.0 [milestone](https://github.com/aralejs/autocomplete/issues?milestone=2&state=closed)

`tag:new` [#10](https://github.com/aralejs/autocomplete/issues/10) 支持 disabled 属性。

`tag:new` [#11](https://github.com/aralejs/autocomplete/issues/11) 控制按键频率。

`tag:new` [#13](https://github.com/aralejs/autocomplete/issues/13) dataSource 支持 ajax。

`tag:new` [#15](https://github.com/aralejs/autocomplete/issues/15) 提供 selectFirst 参数。

`tag:new` [#16](https://github.com/aralejs/autocomplete/issues/16) dataSource 支持复杂的结构。

`tag:improved` [#17](https://github.com/aralejs/autocomplete/issues/17) dataSource 如果是 ajax，filter 的默认值为空。

`tag:improved` [#21](https://github.com/aralejs/autocomplete/issues/21) itemSelect 事件返回的值支持原对象。

`tag:improved` [#22](https://github.com/aralejs/autocomplete/issues/22) 支持ESC关闭浮层。

`tag:improved` [#23](https://github.com/aralejs/autocomplete/issues/23) 去除右键选择的功能。

`tag:fixed` [#14](https://github.com/aralejs/autocomplete/issues/14) 修复异步获取数据，浮层不会显示的问题。

`tag:fixed` [#27](https://github.com/aralejs/autocomplete/issues/27) trigger为textarea，submitOnEnter 处理逻辑的问题。

## 0.8.0

`tag:new` 第一个正式版。

## 0.7.9

`tag:new` 不要用这个版本。

