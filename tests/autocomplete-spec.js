var sinon = require('sinon');
var expect = require('expect.js');
var Filter = require('../src/filter');
var AutoComplete = require('../src/autocomplete');
var $ = require('jquery');
require('alice-select');

Filter.test = function () {
  return [];
};

describe('Autocomplete', function () {

  var input, ac;

  beforeEach(function () {
    input = $('<input id="test" type="text" value="" />').appendTo(document.body);
  });
  afterEach(function () {
    input.remove();
    if (ac) {
      ac.destroy();
      ac = null;
    }
  });

  it('normal usage', function () {
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: function() {
        return ['abc', 'abd', 'cbd'];
      }
    }).render();

    ac.setInputValue('a');

    expect(ac.get('data')).to.eql([{
      label: 'abc',
      value: 'abc',
      target: 'abc',
      alias: [],
      highlightIndex: [
        [0, 1]
      ]
    },
    {
      label: 'abd',
      value: 'abd',
      target: 'abd',
      alias: [],
      highlightIndex: [
        [0, 1]
      ]
    }]);
  });

  it('should hide when empty', function () {
    var input = $('#test');
    input.val('a');
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: ['abc', 'abd', 'cbd']
    }).render();

    ac.setInputValue('');

    expect(ac.get('visiable')).not.to.be.ok();
    expect(ac.input.getValue()).to.be('');
  });

  it('render', function () {
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: ['abc', 'abd', 'cbd']
    }).render();

    ac.setInputValue('a');

    expect(ac.items.length).to.be(2);
    expect(ac.items.eq(0).text().replace(/\s/g, '')).to.be('abc');
    expect(ac.items.eq(1).text().replace(/\s/g, '')).to.be('abd');
  });

  describe('data locator', function () {
    it('should support string', function () {
      ac = new AutoComplete({
        trigger: '#test',
        dataSource: {
          test: ['abc', 'abd', 'cbd']
        },
        locator: 'test'
      }).render();

      ac.setInputValue('a');
      expect(ac.get('data')).to.eql([{
        label: 'abc',
        value: 'abc',
        target: 'abc',
        alias: [],
        highlightIndex: [
          [0, 1]
        ]
      },
      {
        label: 'abd',
        value: 'abd',
        target: 'abd',
        alias: [],
        highlightIndex: [
          [0, 1]
        ]
      }]);
    });

    it('should support dot string', function () {
      ac = new AutoComplete({
        trigger: '#test',
        dataSource: {
          test: {
            more: ['abc', 'abd', 'cbd']
          }
        },
        locator: 'test.more'
      }).render();

      ac.setInputValue('a');
      expect(ac.get('data')).to.eql([{
        label: 'abc',
        value: 'abc',
        target: 'abc',
        alias: [],
        highlightIndex: [
          [0, 1]
        ]
      },
      {
        label: 'abd',
        value: 'abd',
        target: 'abd',
        alias: [],
        highlightIndex: [
          [0, 1]
        ]
      }]);
    });

    it('should support function', function () {
      ac = new AutoComplete({
        trigger: '#test',
        dataSource: {
          test1: ['abc', 'cbd'],
          test2: ['abd']
        },
        locator: function (data) {
          return data.test1.concat(data.test2);
        }
      }).render();

      ac.setInputValue('a');
      expect(ac.get('data')).to.eql([{
        label: 'abc',
        value: 'abc',
        target: 'abc',
        alias: [],
        highlightIndex: [
          [0, 1]
        ]
      },
      {
        label: 'abd',
        value: 'abd',
        target: 'abd',
        alias: [],
        highlightIndex: [
          [0, 1]
        ]
      }]);
    });

    it('wrong locator', function () {
      ac = new AutoComplete({
        trigger: '#test',
        dataSource: {
          test: ['abc', 'abd', 'cbd']
        },
        locator: 'wrong'
      }).render();

      ac.setInputValue('a');
      expect(ac.get('data')).to.eql([]);
    });
  });

  it('should be hide when trigger blur #26', function () {
    if ($.browser.msie) return;
    var input = $('#test');
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: ['abc']
    }).render();
    ac.setInputValue('a');
    input.blur();

    expect(ac.get('visible')).not.to.be.ok();
  });

  it('should be hide when mousedown #26', function () {
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: ['abc']
    }).render();
    ac.setInputValue('a');
    ac.items.eq(0).click();

    expect(ac.get('visible')).not.to.be.ok();
  });

  it('should not be hide when mousedown #26', function () {
    ac = new AutoComplete({
      trigger: '#test',
      template: '<div><p data-role="other">a</p><ul data-role="items">{{#each items}}<li data-role="item">{{label}}</li>{{/each}}</ul></div>',
      dataSource: ['abc']
    }).render();
    ac.setInputValue('a');
    expect(ac.get('visible')).to.be.ok();
    ac.element.find('[data-role=other]').mousedown();

    expect(ac.get('visible')).to.be.ok();
  });

  describe('filter', function () {
    it('should be "startsWith" by default', function () {
      ac = new AutoComplete({
        trigger: '#test',
        dataSource: []
      });
      expect(ac.get('filter')).to.eql(Filter['startsWith']);
    });
    it('should be "default" when ajax by default', function () {
      ac = new AutoComplete({
        trigger: '#test',
        dataSource: './data.json'
      });
      expect(ac.get('filter')).to.eql(Filter['default']);
    });
    it('should be "default" when "", null, false', function () {
      ac = new AutoComplete({
        trigger: '#test',
        filter: '',
        dataSource: []
      });

      expect(ac.get('filter')).to.eql(Filter['default']);
    });
    it('should support string', function () {
      ac = new AutoComplete({
        trigger: '#test',
        filter: 'test',
        dataSource: []
      });

      expect(ac.get('filter')).to.eql(Filter.test);
    });

    it('should support string but not exist', function () {
      ac = new AutoComplete({
        trigger: '#test',
        filter: 'notExist',
        dataSource: []
      });

      expect(ac.get('filter')).to.eql(Filter['default']);
    });
    it('should support function', function () {
      var func = function () {};
      ac = new AutoComplete({
        trigger: '#test',
        filter: func,
        dataSource: []
      });

      expect(ac.get('filter')).to.eql(func);
    });
    it('should support object but not exist', function () {
      ac = new AutoComplete({
        trigger: '#test',
        filter: 'notExist',
        dataSource: []
      });

      expect(ac.get('filter')).to.eql(Filter['default']);
    });
    it('should be called with 4 param', function () {
      var spy = sinon.spy();
      Filter.filter = spy;
      ac = new AutoComplete({
        trigger: '#test',
        filter: 'filter',
        dataSource: ['abc']
      }).render();

      ac.setInputValue('a');
      var data = [{
        label: 'abc',
        value: 'abc',
        target: 'abc',
        alias: []
      }];
      expect(spy.withArgs(data, 'a').called).to.be.ok();
    });
  });

  it('select item', function () {
    var input = $('#test'),
        spy = sinon.spy();
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: ['abc', 'abd', 'cbd']
    }).on('itemSelected', spy).render();

    ac.setInputValue('a');
    ac.set('selectedIndex', 0);
    ac.selectItem();
    expect(ac.get('visible')).to.be(false);
    expect(input.val()).to.be('abc');
    expect(ac.input.getValue()).to.be('abc');
    expect(spy.called).to.be.ok();

    ac.setInputValue('ab');
    ac.selectItem(1);
    expect(ac.get('visible')).to.be(false);
    expect(input.val()).to.be('abd');
    expect(ac.input.getValue()).to.be('abd');
    expect(spy.calledTwice).to.be.ok();
  });

  it('specify final input-value individually', function () {
    var input = $('#test'),
    ac = new AutoComplete({
      trigger: '#test',
      filter: 'stringMatch',
      dataSource: ['abc', 'abd', 'cbd', {
          value: '天弘增利宝货币 000198 TIANHONGZENGLIBAO',
          label: '天弘增利宝货币 000198',
          target: '000198'
      }]
    }).render();

    ac.setInputValue('TIAN');
    ac.set('selectedIndex', 0);
    ac.selectItem();
    expect(input.val()).to.be('000198');
    expect(ac.input.getValue()).to.be('000198');
  });

  it('highlight item', function () {
    var item;
    ac = new AutoComplete({
      trigger: '#test',
      html: '{{{highlightItem label}}}',
      dataSource: ['abc', 'abd', 'cbd']
    }).render();

    ac.set('data', [{
      label: 'abcdefg',
      highlightIndex: [
        [0, 1]
      ]
    }]);
    item = ac.$('[data-role=item]').eq(0).find('.ui-select-item-hl');
    expect(item.length).to.be(1);
    expect(item.eq(0).text()).to.be('a');

    ac.set('data', [{
      label: 'abcdefg',
      highlightIndex: [
        [1, 2],
        [3, 4]
      ]
    }]);
    item = ac.$('[data-role=item]').eq(0).find('.ui-select-item-hl');
    expect(item.length).to.be(2);
    expect(item.eq(0).text()).to.be('b');
    expect(item.eq(1).text()).to.be('d');

    ac.set('data', [{
      label: 'abcdefg',
      highlightIndex: [
        [0, 1],
        [3, 7],
        [8, 9]
      ]
    }]);
    item = ac.$('[data-role=item]').eq(0).find('.ui-select-item-hl');
    expect(item.length).to.be(2);
    expect(item.eq(0).text()).to.be('a');
    expect(item.eq(1).text()).to.be('defg');

    ac.set('data', [{
      label: 'abcdefg',
      highlightIndex: [1, 4]
    }]);
    item = ac.$('[data-role=item]').eq(0).find('.ui-select-item-hl');
    expect(item.length).to.be(2);
    expect(item.eq(0).text()).to.be('b');
    expect(item.eq(1).text()).to.be('e');

    ac.set('data', [{
      label: 'abcdefg',
      highlightIndex: [6, 8]
    }]);
    item = ac.$('[data-role=item]').eq(0).find('.ui-select-item-hl');
    expect(item.length).to.be(1);
    expect(item.eq(0).text()).to.be('g');

    ac.set('data', [{
      label: 'abcdefg',
      highlightIndex: 0
    }]);
    item = ac.$('.ui-select-item-hl');
    expect(item.length).to.be(0);
  });

  it('clear', function () {
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: ['abc', 'abd', 'cbd']
    }).render();

    ac.setInputValue('a');

    ac._clear();
    expect(ac.$('[data-role=items]').html()).to.be('');
    expect(ac.items).to.be(undefined);
    expect(ac.currentItem).to.be(undefined);
    expect(ac.currentItem).to.be(undefined);
    expect(ac.get('selectedIndex')).to.be(-1);
  });

  it('do not show when async #14', function (done) {
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: 'http://baidu.com'
    }).render();

    var spy = sinon.stub($, 'ajax').returns({
      success: function (callback) {
        setTimeout(function () {
          callback(['abc', 'abd', 'cbd']);
        }, 50);
        return this;
      },
      error: function () {}
    });

    ac.setInputValue('a');

    setTimeout(function () {
      expect(ac.get('visible')).to.be.ok();
      spy.restore();
      done();
    }, 50);

  });

  it('should support selectFirst', function () {
    ac = new AutoComplete({
      trigger: '#test',
      selectFirst: true,
      dataSource: ['abc', 'abd', 'cbd']
    }).render();

    ac.setInputValue('a');
    expect(ac.get('selectedIndex')).to.be(0);


  });

  it('should show when same value', function () {
    ac = new AutoComplete({
      trigger: '#test',
      selectFirst: true,
      dataSource: ['abc', 'abd', 'cbd']
    }).render();

    ac.setInputValue('a');
    expect(ac.get('visible')).to.be.ok();

    ac.setInputValue('');
    expect(ac.get('visible')).not.to.be.ok();

    ac.setInputValue('a');
    expect(ac.get('visible')).to.be.ok();
  });

  it('normalize', function () {
    ac = new AutoComplete({
      trigger: '#test',
      filter: 'default',
      dataSource: ['aa', 'ba',
      {
        title: 'ab'
      },
      {
        value: 'ac'
      },
      {
        label: 'bc',
        other: 'bc'
      },
      {
        label: 'ad',
        value: 'ad'
      },
      {
        label: 'ae',
        value: 'ae',
        alias: ['be']
      }]
    }).render();

    ac.setInputValue('a');
    expect(ac.get('data')).to.eql([{
      label: 'aa',
      value: 'aa',
      target: 'aa',
      alias: []
    },
    {
      label: 'ba',
      value: 'ba',
      target: 'ba',
      alias: []
    },
    {
      label: 'ac',
      value: 'ac',
      target: 'ac',
      alias: []
    },
    {
      label: 'bc',
      value: 'bc',
      target: 'bc',
      alias: [],
      other: 'bc'
    },
    {
      label: 'ad',
      value: 'ad',
      target: 'ad',
      alias: []
    },
    {
      label: 'ae',
      value: 'ae',
      target: 'ae',
      alias: ['be']
    }]);
  });

  it('should step', function () {
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: ['abc', 'abd', 'cbd']
    }).render();

    ac.setInputValue('a');

    ac.items.eq(1).mouseenter();
    expect(ac.get('selectedIndex')).to.be(1);

    triggerKeyEvent(input, 40);
    expect(ac.get('selectedIndex')).to.be(-1);

    triggerKeyEvent(input, 40);
    expect(ac.get('selectedIndex')).to.be(0);

    triggerKeyEvent(input, 38);
    expect(ac.get('selectedIndex')).to.be(-1);

    triggerKeyEvent(input, 38);
    expect(ac.get('selectedIndex')).to.be(1);
  });

  it('input focus', function () {
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: ['abc', 'abd', 'cbd']
    }).render();

    input.focus();
    expect(ac._isOpen).to.be.ok();
  });

  it('dataSource should call on ac', function () {
    var spy = sinon.spy();
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: spy
    }).render();
    ac.setInputValue('a');
    expect(spy.calledOn(ac)).to.be.ok();
  });

  it('should auto scroll #82', function () {
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: ['abc', 'abd', 'abe', 'acd', 'ace', 'acf', 'acg', 'ach', 'aci', 'acj', 'ack'],
      height: 123
    }).render();
    ac.element.children().css('overflow', 'scroll');

    ac.setInputValue('a');
    expect(ac.get('visible')).to.be.ok();

    var content = ac.element.children();
    ac._step(1);
    expect(content.scrollTop()).to.be(0);
    ac._step(1);
    expect(content.scrollTop()).to.be(0);
    ac._step(1);
    expect(content.scrollTop()).to.be(0);
    ac._step(1);
    expect(content.scrollTop()).to.be(41);
  });

  it('should not contain a #98', function() {
    ac = new AutoComplete({
      trigger: '#test',
      dataSource: ['abc', 'abd', 'abe']
    }).render();
    ac.setInputValue('a');
    expect(ac.items.eq(0).find('a')[0]).to.be(undefined);
  });
});

function triggerKeyEvent(el, keyCode) {
  var e = $.Event('keydown.autocomplete');
  e.which = keyCode;
  el.trigger(e);
}
