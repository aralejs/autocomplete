define(function(require, exports, module) {

  var $ = require('$');
  var selection = require('selection');
  var AutoComplete = require('./autocomplete');

  var TextareaComplete = AutoComplete.extend({

    attrs: {
      cursor: false
    },

    setup: function() {
      TextareaComplete.superclass.setup.call(this);
      this.sel = selection(this.get('trigger'));

      var inputFilter = this.get('inputFilter'), that = this;
      this.set('inputFilter', function(val) {
        var v = val.substring(0, that.sel.cursor()[1]);
        return inputFilter.call(that, v);
      });

      if (this.get('cursor')) {
        this.mirror = Mirror.init(this.get('trigger'));
        this.dataSource.before('getData', function() {
          that.mirror.setContent(
            that.get('inputValue'),
            that.queryValue,
            that.sel.cursor()
          );
        });
      }
    },

    _keyUp: function(e) {
      if (this.get('visible')) {
        e.preventDefault();
        if (this.get('data').length) {
          this._step(-1);
        }
      }
    },

    _keyDown: function(e) {
      if (this.get('visible')) {
        e.preventDefault();
        if (this.get('data').length) {
          this._step(1);
        }
      }
    },

    _keyEnter: function(e) {
      // 如果没有选中任一一项也不会阻止
      if (this.get('visible')) {
        if (this.currentItem) {
          e.preventDefault();
          e.stopImmediatePropagation(); // 阻止冒泡及绑定的其他 keydown 事件
          this.selectItem();
        } else {
          this.hide();
        }
      }
    },

    show: function() {
      var cursor = this.get('cursor');
      if (cursor) {
        if ($.isArray(cursor)) {
          var offset = cursor;
        } else {
          var offset = [0, 0];
        }
        var pos = this.mirror.getFlagRect();
        var align = this.get('align');
        align.baseXY = [pos.left + offset[0], pos.bottom + offset[1]];
        align.selfXY = [0, 0];
        this.set('align', align);
      }
      TextareaComplete.superclass.show.call(this);
    },

    selectItem: function() {
      this.hide();

      var item = this.currentItem,
      index = this.get('selectedIndex'),
      data = this.get('data')[index];

      if (item) {
        var matchKey = item.attr('data-value');
        var right = this.sel.cursor()[1];
        var left = right - this.queryValue.length;
        this.sel
          .cursor(left, right)
          .text('')
          .append(matchKey, 'right');

        var value = this.get('trigger').val();
        this.set('inputValue', value);
        this.mirror && this.mirror.setContent(value, '', this.sel.cursor());
        this.trigger('itemSelect', data);
        this._clear();
      }
    }
  });

  // 计算光标位置
  // MIT https://github.com/ichord/At.js/blob/master/js/jquery.atwho.js
  var Mirror = {
    mirror: null,
    css: ["overflowY", "height", "width", "paddingTop", "paddingLeft", "paddingRight", "paddingBottom", "marginTop", "marginLeft", "marginRight", "marginBottom", 'fontFamily', 'borderStyle', 'borderWidth', 'wordWrap', 'fontSize', 'lineHeight', 'overflowX'],
    init: function(origin) {
      origin = $(origin);
      var css = {
        position: 'absolute',
        left: -9999,
        top: 0,
        zIndex: -20000,
        'white-space': 'pre-wrap'
      };
      $.each(this.css, function(i, p) {
        return css[p] = origin.css(p);
      });
      this.mirror = $('<div><span></span></div>')
        .css(css)
        .insertAfter(origin);
      return this;
    },
    setContent: function(content, query, cursor) {
      var left = query ? (cursor[1] - query.length) : cursor[1];
      var right = cursor[1];
      var v = [
        '<span>',
          content.substring(0, left),
        '</span>',
        '<span id="flag">',
          (query || ''),
        '</span>',
        '<span>',
          content.substring(right),
        '</span>'
      ].join('');
      this.mirror.html(v);
      return this;
    },
    getFlagRect: function() {
      var pos, rect, flag;
      flag = this.mirror.find('span#flag');
      pos = flag.position();
      rect = {
        left: pos.left,
        right: flag.width() + pos.left,
        top: pos.top,
        bottom: flag.height() + pos.top
      };
      return rect;
    }
  };

  module.exports = TextareaComplete;
});

