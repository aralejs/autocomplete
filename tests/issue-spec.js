define(function(require) {

  var expect = require('puerh');
  var $ = require('$');
  var Filter = require('filter');
  var AutoComplete = require('autocomplete');

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

    it('#55 dont\'t change selectedIndex when hover', function() {
      var ac, input = $('<input id="test" type="text" value="" />')
        .appendTo(document.body);

      ac = new AutoComplete({
          trigger: '#test',
          dataSource: ['abc', 'abd', 'cbd']
      }).render();

      ac.setInputValue('a');
      var item = ac.$('li').eq(1);
      item.mouseenter();
      expect(item.hasClass('ui-autocomplete-item-hover')).to.be.ok();
      expect(ac.get('selectedIndex')).to.be(-1);

      input.remove();
      ac.destroy();
    });

    it('#72 start with \\', function() {
      var ac, input = $('<input id="test" type="text" value="" />')
        .appendTo(document.body);

      ac = new AutoComplete({
          trigger: '#test',
          dataSource: []
      }).render();

      expect(function() {
        ac.setInputValue('\\');
      }).not.to.throwError();

      input.remove();
      ac.destroy();
    });
  });
});
