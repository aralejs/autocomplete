<script>
seajs.config({
    map: [
        ['overlay.js', 'overlay-debug.js'],
        ['widget.js', 'widget-debug.js']
    ]
})
</script>

<input id="acTrigger" type="text" value="" />

```javascript
seajs.use('../src/autocomplete', function(AutoComplete) {
    new AutoComplete({
        trigger: '#acTrigger',
        dataSource: ''
    }).render();
});
```

```javascript
seajs.use('../src/data-source', function(DataSource) {
    var source = new DataSource({
        source: ['a', 'b', 'c']
    }).on('data', function(source) {
        console.log('data change')
        console.log(source);
    });

    var data = source.getData();
    console.log(data);
});
```


```javascript
seajs.use('../src/data-source', function(DataSource) {
    var source = new DataSource({
        source: 'http://www.alipay.com/test.json?v={{query}}'
    }).on('data', function(source) {
        console.log('data change')
        console.log(source);
    });

    var data = source.getData();
});
```


