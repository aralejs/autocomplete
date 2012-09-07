# Filter

----

过滤是 autocomplete 数据操作的核心环节，将 dataSource 的数据根据一些规则进行处理，返回的数据再进行模版渲染。

过滤器的输入有两个

1. dataSource 的返回值
2. input 过滤后的返回值

过滤器的输出直接给模版引擎

### 使用方式

```
filter: 'startsWith'
```

## 过滤规则

### startsWith

从头开始全匹配输入的值

提供 dataSource

```
['abc', 'abd', 'bcd']
```

输入 `a` 后显示 abc 和 abd