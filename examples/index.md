<style>
.ui-autocomplete{
    border: 1px solid #CCC;
    background:#fff;
    padding: 2px 0;
}
.ui-autocomplete-ctn{
    margin:0;
    padding:0;
}
.ui-autocomplete-item{
    padding: 4px 10px;
    list-style: none;
}
.ui-autocomplete-hl {
    background: #ff0;
}
</style>

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
        dataSource: ['abc', 'abd', 'abe']
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


