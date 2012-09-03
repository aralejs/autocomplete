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
.ui-autocomplete-item-hover{
    background:#0f0;
}
.ui-autocomplete-item-hl {
    background: #ff0;
}
</style>

<script>
seajs.config({
    map: [
        //[/(\d(?:\/dist)?\/[a-z]+)\.js$/, '$1-debug.js']
        //['overlay.js', 'overlay-debug.js'],
        //['templatable.js', 'templatable-debug.js']
    ]
})
</script>

<form name="" action="">
    <input id="acTrigger" type="text" value="" />
</form>

````javascript
seajs.use('../src/autocomplete', function(AutoComplete) {
    new AutoComplete({
        trigger: '#acTrigger',
        submitOnEnter: false,
        dataSource: ['abc', 'abd', 'abe']
    }).render();
});
````


<input id="acTrigger1" type="text" value="" />

````javascript
seajs.use('../src/autocomplete', function(AutoComplete) {
    new AutoComplete({
        trigger: '#acTrigger1',
        dataSource: {
            data : ['abc', 'abd', 'abe']
        }
    }).render();
});
````

````javascript
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
````


````javascript
seajs.use('../src/data-source', function(DataSource) {
    var source = new DataSource({
        source: './test.json?v={{query}}'
    }).on('data', function(source) {
        console.log('data change')
        console.log(source);
    });

    var data = source.getData();
});
````


<input id="example" type="text" value="" />

````javascript
seajs.use(['../src/autocomplete', '$'], function(AutoComplete, $) {
    var data = [
        '163.com',
        '126.com',
        'gmail.com'
    ];
    new AutoComplete({
        trigger: '#example',
        dataSource: function(query) {
            return $.map(data, function(v, i) {
                return query + '@' + v;
            });
        }
    }).render();
});
````
