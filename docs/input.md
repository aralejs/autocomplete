# 输入框

- order: 5

---

输入框的一个抽象，Autocomplete 内部会实例化这个对象，只需要操作这个实例。

## API

### 属性

#### element

输入框的对象

#### query

输入框中的值

#### delay

按键频率，每次按键的间隔，在这个时间范围内不会处理过滤流程。

### 方法

#### focus

使输入框 focus，简单调用封装。

##### getValue

获取输入框的值

#### setValue

设置输入框的值，当输入值有变化的情况下会触发 `queryChanged` 或 `whitespaceChanged` 事件。

### 事件

#### queryChanged

当输入框的值发生变化的时候触发（不包括空白）

#### whitespaceChanged

当输入框的值发生变化的时候触发（包括空白）

#### focus

对应输入框的 focus 事件

#### blur

对应输入框的 blur 事件

#### keyTab

对应输入框的 keydown 事件，并且按键为 tab

#### keyEsc

对应输入框的 keydown 事件，并且按键为 esc

#### keyLeft

对应输入框的 keydown 事件，并且按键为 left arrow

#### keyRight

对应输入框的 keydown 事件，并且按键为 right arrow

#### keyEnter

对应输入框的 keydown 事件，并且按键为 enter

#### keyUp

对应输入框的 keydown 事件，并且按键为 up arrow

#### keyDown

对应输入框的 keydown 事件，并且按键为 down arrow

