define(function(require, exports, module) {

  var $ = require('$');
  var Base = require('base');

  var lteIE9 = /\bMSIE [6789]\.0\b/.test(navigator.userAgent);
  var specialKeyCodeMap = {
    9: 'tab',
    27: 'esc',
    37: 'left',
    39: 'right',
    13: 'enter',
    38: 'up',
    40: 'down'
  };

  var Input = Base.extend({

    attrs: {
      element: {
        value: null,
        setter: function(val) {
          return $(val);
        }
      },
      delay: 100
    },

    initialize: function() {
      Input.superclass.initialize.apply(this, arguments);

      // bind events
      this._bindEvents();

      // init query
      this.query = this.get('element').val();
    },

    destroy: function() {
      Input.superclass.destroy.call(this);
    },

    _bindEvents: function() {
      var timer, input = this.get('element');

      input
      .attr('autocomplete', 'off')
      .on('focus.autocomplete', wrapFn(this._handleFocus, this))
      .on('blur.autocomplete', wrapFn(this._handleBlur, this))
      .on('keydown.autocomplete', wrapFn(this._handleKeydown, this))
      .on('keyUp.autocomplete', wrapFn(this._handleKeyup, this));

      // IE678 don't support input event
      // IE 9 does not fire an input event when the user removes characters from input filled by keyboard, cut, or drag operations.
      if (!lteIE9) {
        input.on('input.autocomplete', wrapFn(this._change, this));
      } else {
        var that = this,
          events = [
            'keydown.autocomplete',
            'keypress.autocomplete',
            'cut.autocomplete',
            'paste.autocomplete'
          ].join(' ');

        input.on(events, function(e) {
          if (specialKeyCodeMap[e.which]) return;

          clearTimeout(timer);
          timer = setTimeout(function() {
            that._change.call(that, e);
          }, this.get('delay'));
        });
      }
    },

    _change: function() {
      var val = this.get('element').val();
      var isSame = compare(this.query, val);
      var isSameExpectWhitespace = isSame ? (val.length !== this.query.length) : false;

      if (isSameExpectWhitespace) {
        this.trigger('whitespaceChanged', this.query);
      }
      if (!isSame) {
        var oldVal = this.query;
        this.trigger('queryChanged', this.query = val, oldVal);
      }
    },

    _handleFocus: function(e) {
      this.trigger('focus', e, 'focus');
    },

    _handleBlur: function(e) {
      this.trigger('blur', e, 'blur');
    },

    _handleKeydown: function(e) {
      var keyName = specialKeyCodeMap[e.which];
      keyName && this.trigger('key' + ucFirst(keyName), e, keyName);
    }
  });

  module.exports = Input;

  function wrapFn(fn, context) {
    return function() {
      fn.apply(context, arguments);
    };
  }

  function compare(a, b) {
    a = (a || '').replace(/^\s*/g, '').replace(/\s{2,}/g, ' ');
    b = (b || '').replace(/^\s*/g, '').replace(/\s{2,}/g, ' ');
    return a === b;
  }

  function ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
});
