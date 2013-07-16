# input

- order:4

---

<input id="example">

````javascript
seajs.use(['input', '$'], function(Input, $) {
  var input = new Input({
    element: '#example'
  })
  .on('focus', print)
  .on('blur', print)
  .on('keyTab', print)
  .on('keyEsc', print)
  .on('keyLeft', print)
  .on('keyRight', print)
  .on('keyUp', print)
  .on('keyDown', print)
  .on('keyEnter', print)
  .on('queryChanged', function(val) {
    console.log('queryChanged: ' + val)
  })
  .on('whitespaceChanged', function(val) {
    console.log('whitespaceChanged: ' + val)
  })

  function print(e, keyName) {
    console.log(keyName);
  }
});
````
