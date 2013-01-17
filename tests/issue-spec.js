define(function(require) {

  var Filter = require('../src/filter');

  describe('Issue', function() {
    it('#56 start with (', function() {
      var data = [
        'about',
        {value: 'abuse'},
        {title: 'absolute'},
        'but',
        'buffer',
        '(abc'
      ];
      var result = Filter.startsWith(data, '(a');
      expect(result).to.eql([
        {matchKey: '(abc', highlightIndex: [[0, 2]]}
      ]);
    });

    it('dont\'t change when hover', function() {
    
    });
  });
});
