# 数据源 dataSource

- order: 2

----

数据源是 autocomplete 的基础，数据可以是静态的也可以是动态的。

只提供 `.getData` 的方法获取数据，通过 data 事件异步返回。

```
var source = new DataSource({
    source: ['abc', 'abd', 'bcd']
}).on('data', function(data) {
    // ouput: ['abc', 'abd']
});
source.getData('a');
```


## 属性

### source *array | object | string | function*

数据源支持 Function, Array, Object, URL，可查看 [README dataSource 属性](http://aralejs.org/autocomplete/index.html)。

如果是 Function，可通过 `return false` 阻止 data 事件

```
var source = new DataSource({
    source: function(value) {
        return false;
    }
}).on('data', function(data) {
    // won't fire if return false
});
source.getData('a');
```

## 方法

### getData(value)

获取 data，成功后会触发 data 事件。

value 为输入框过滤后的值(realValue)

### abort

阻止之前发送的请求，在调用 abort 时只会阻止正在发送中的请求，这些请求不会执行回调

```
source.getData('a'); // 已执行
source.getData('a'); // 请求中
source.getData('a'); // 请求中
source.abort(); // 阻止 2 和 3 的执行
source.getData('a'); 
```

## 事件

### data

获取 data 成功后会触发这个事件，因为会涉及到异步，所以统一用事件处理。
