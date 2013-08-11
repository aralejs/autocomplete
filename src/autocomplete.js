define(function(require, exports, module) {

  var $ = require('$');
  var Overlay = require('overlay');
  var Templatable = require('templatable');
  var DataSource = require('./data-source');
  var Filter = require('./filter');
  var Input = require('./input');

  var IE678 = /\bMSIE [678]\.0\b/.test(navigator.userAgent);
  var template = require('./autocomplete.handlebars');

  var AutoComplete = Overlay.extend({

    Implements: Templatable,

    attrs: {
      // 触发元素
      trigger: null,
      classPrefix: 'ui-select',
      align: {
        baseXY: [0, '100%']
      },
      submitOnEnter: true, // 回车是否会提交表单
      dataSource: [], //数据源，支持 Array, URL, Object, Function
      locator: 'data',
      // 输出过滤
      filter: null,
      disabled: false,
      selectFirst: false,
      delay: 100,
      // 以下为模板相关
      model: {
        value: {
          items: []
        },
        getter: function(val) {
          val.classPrefix || (val.classPrefix = this.get('classPrefix'));
          return val;
        }
      },
      template: template,
      footer: '',
      header: '',
      html: '<a href="javascript:\'\'">{{label}}</a>',
      // 以下仅为组件使用
      selectedIndex: null,
      data: []
    },

    events: {
      'mousedown [data-role=items]': '_handleMouseDown',
      'click [data-role=item]': '_handleSelection',
      'mouseenter [data-role=item]': '_handleMouseMove',
      'mouseleave [data-role=item]': '_handleMouseMove'
    },

    templateHelpers: {
      // 将匹配的高亮文字加上 hl 的样式
      highlightItem: highlightItem
    },

    parseElement: function() {
      var t = ['header', 'footer', 'html'];
      for (var i in t) {
        this.templatePartials || (this.templatePartials = {});
        this.templatePartials[t[i]] = this.get(t[i]);
      }
      AutoComplete.superclass.parseElement.call(this);
    },

    setup: function() {
      AutoComplete.superclass.setup.call(this);

      this._isOpen = false;
      this._initInput(); // 初始化输入框
      this._initDataSource(); // 初始化数据源
      this._initFilter(); // 初始化过滤器
      this._bindHandle(); // 绑定事件
      this._blurHide([$(this.get('trigger'))]);
      this._tweakAlignDefaultValue();
    },

    show: function() {
      this._isOpen = true;
      // 无数据则不显示
      if (this._isEmpty()) return;
      AutoComplete.superclass.show.call(this);
    },

    hide: function() {
      // 隐藏的时候取消请求或回调
      if (this._timeout) clearTimeout(this._timeout);
      this.dataSource.abort();
      this._hide();
    },

    destroy: function() {
      this._clear();
      if (this.input) {
        this.input.destroy();
        this.input = null;
      }
      AutoComplete.superclass.destroy.call(this);
    },


    // Public Methods
    // --------------

    selectItem: function(index) {
      if (this.items && index &&
        this.items.length > index && index >= -1) {
        this.set('selectedIndex', index);
        this._handleSelection();
      }
    },

    setInputValue: function(val) {
      this.input.setValue(val);
    },

    // Private Methods
    // ---------------


    // 数据源返回，过滤数据
    _filterData: function(data) {
      var filter = this.get('filter'),
        locator = this.get('locator');

      // 获取目标数据
      data = locateResult(locator, data);

      // 进行过滤
      data = filter.call(this, normalize(data), this.input.get('query'));

      this.set('data', data);
    },

    // 通过数据渲染模板
    _onRenderData: function(data) {
      if (!data.length) return;

      // 渲染下拉
      this.set("model", {
        items: data,
        query: this.input.get('query')
      });

      this.renderPartial();

      // 初始化下拉的状态
      this.items = this.$('[data-role=items]').children();

      if (this.get('selectFirst')) {
        this.set('selectedIndex', 0);
      }

      // 选中后会修改 input 的值并触发下一次渲染，但第二次渲染的结果不应该显示出来。
      this._isOpen && this.show();
    },

    // 键盘控制上下移动
    _onRenderSelectedIndex: function(index) {
      var hoverClass = this.get('classPrefix') + '-item-hover';
      this.items && this.items.removeClass(hoverClass);

      // -1 什么都不选
      if (index === -1) return;

      this.items.eq(index).addClass(hoverClass);
      this.trigger('indexChanged', index, this.lastIndex);
      this.lastIndex = index;
    },

    // 初始化
    // ------------

    _initDataSource: function() {
      this.dataSource = new DataSource({
        source: this.get('dataSource')
      });
    },

    _initInput: function() {
      this.input = new Input({
        element: this.get('trigger'),
        delay: this.get('delay')
      });
    },

    _initFilter: function() {
      var filter = this.get('filter');
      filter = initFilter(filter, this.dataSource);
      this.set('filter', filter);
    },

    // 事件绑定
    // ------------

    _bindHandle: function() {
      this.dataSource
        .on('data', this._filterData, this);

      this.input
        .on('blur', this.hide, this)
        .on('focus', this._handleFocus, this)
        .on('keyEnter', this._handleSelection, this)
        .on('keyEsc', this.hide, this)
        .on('keyUp keyDown', this.show, this)
        .on('keyUp keyDown', this._handleStep, this)
        .on('queryChanged', this._clear, this)
        .on('queryChanged', this._hide, this)
        .on('queryChanged', this._handleQueryChange, this)
        .on('queryChanged', this.show, this);

      this.after('hide', function() {
        this.set('selectedIndex', -1);
      });

      // 选中后隐藏浮层
      this.on('itemSelected', function() {
        this._hide();
      });
    },

    // 选中的处理器
    // 1. 鼠标点击触发
    // 2. 回车触发
    // 3. selectItem 触发
    _handleSelection: function(e) {
      var isMouse = e ? e.type === 'click' : false;
      var index = isMouse ? this.items.index(e.currentTarget) : this.get('selectedIndex');
      var item = this.items.eq(index);
      var data = this.get('data')[index];

      if (index >= 0 && item) {
        this.input.setValue(data.label);
        this.set('selectedIndex', index, {silent: true});

        // 是否阻止回车提交表单
        if (e && !isMouse && !this.get('submitOnEnter')) e.preventDefault();

        this.trigger('itemSelected', data, item);
      }
    },

    _handleFocus: function() {
      this._isOpen = true;
    },

    _handleMouseMove: function(e) {
      var hoverClass = this.get('classPrefix') + '-item-hover';
      this.items.removeClass(hoverClass);
      if (e.type === 'mouseenter') {
        var index = this.items.index(e.currentTarget);
        this.set('selectedIndex', index, {
          silent: true
        });
        this.items.eq(index).addClass(hoverClass);
      }
    },

    _handleMouseDown: function(e) {
      if (IE678) {
          var trigger = this.input.get('element')[0];
          trigger.onbeforedeactivate = function() {
            window.event.returnValue = false;
            trigger.onbeforedeactivate = null;
          };
        }
      e.preventDefault();
    },

    _handleStep: function(e) {
      e.preventDefault();
      this.get('visible') &&
        this._step(e.type === 'keyUp' ? -1 : 1);
    },

    _handleQueryChange: function(val, prev) {
      if (this.get('disabled')) return;

      this.dataSource.abort();
      this.dataSource.getData(val);
    },

    // 选项上下移动
    _step: function(direction) {
      var currentIndex = this.get('selectedIndex');
      if (direction === -1) { // 反向
        if (currentIndex > -1) {
          this.set('selectedIndex', currentIndex - 1);
        } else {
          this.set('selectedIndex', this.items.length - 1);
        }
      } else if (direction === 1) { // 正向
        if (currentIndex < this.items.length - 1) {
          this.set('selectedIndex', currentIndex + 1);
        } else {
          this.set('selectedIndex', -1);
        }
      }
    },

    _clear: function() {
      this.$('[data-role=items]').empty();
      this.set('selectedIndex', -1);
      delete this.items;
      delete this.lastIndex;
    },

    _hide: function() {
      this._isOpen = false;
      AutoComplete.superclass.hide.call(this);
    },

    _isEmpty: function() {
      var data = this.get('data');
      return !(data && data.length > 0);
    },

    // 调整 align 属性的默认值
    _tweakAlignDefaultValue: function() {
      var align = this.get('align');
      align.baseElement = this.get('trigger');
      this.set('align', align);
    }
  });

  module.exports = AutoComplete;

  function isString(str) {
    return Object.prototype.toString.call(str) === '[object String]';
  }

  function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  // 通过 locator 找到 data 中的某个属性的值
  // 1. locator 支持 function，函数返回值为结果
  // 2. locator 支持 string，而且支持点操作符寻址
  //     data {
  //       a: {
  //         b: 'c'
  //       }
  //     }
  //     locator 'a.b'
  // 最后的返回值为 c

  function locateResult(locator, data) {
    if (!locator) {
      return data;
    }
    if ($.isFunction(locator)) {
      return locator.call(this, data);
    } else if (isString(locator)) {
      var s = locator.split('.'),
        p = data;
      while (s.length) {
        var v = s.shift();
        if (!p[v]) {
          break;
        }
        p = p[v];
      }
      return p;
    }
    return data;
  }

  // 标准格式，不匹配则忽略
  //
  //   {
  //     label: '', 显示的字段
  //     value: '', 匹配的字段
  //     alias: []  其他匹配的字段
  //   }

  function normalize(data) {
    var result = [];
    $.each(data, function(index, item) {
      if (isString(item)) {
        result.push({
          label: item,
          value: item,
          alias: []
        });
      } else if (isObject(item)) {
        if (!item.value && !item.label) return;
        item.value || (item.value = item.label);
        item.label || (item.label = item.value);
        item.alias || (item.alias = []);
        result.push(item);
      }
    });
    return result;
  }

  // 初始化 filter
  // 支持的格式
  //   1. null: 使用默认的 startWith
  //   2. string: 从 Filter 中找
  //   3. function: 自定义

  function initFilter(filter, dataSource) {
    // 字符串
    if (isString(filter)) {
      // 从组件内置的 FILTER 获取
      if (Filter[filter]) {
        filter = Filter[filter];
      } else {
        filter = Filter['startsWith'];
      }
    }
    // 非函数为默认值
    else if (!$.isFunction(filter)) {
      // 异步请求的时候不需要过滤器
      if (dataSource.get('type') === 'url') {
        filter = Filter['default'];
      } else {
        filter = Filter['startsWith'];
      }
    }
    return filter;
  }

  function highlightItem(label, classPrefix) {
    var index = this.highlightIndex,
      cursor = 0,
      v = label || this.label || '',
      h = '';
    if ($.isArray(index)) {
      for (var i = 0, l = index.length; i < l; i++) {
        var j = index[i],
          start, length;
        if ($.isArray(j)) {
          start = j[0];
          length = j[1] - j[0];
        } else {
          start = j;
          length = 1;
        }

        if (start > cursor) {
          h += v.substring(cursor, start);
        }
        if (start < v.length) {
          var className = classPrefix ? ('class="' + classPrefix + '-item-hl"') : '';
          h += '<span ' + className + '>' +
            v.substr(start, length) +
            '</span>';
        }
        cursor = start + length;
        if (cursor >= v.length) {
          break;
        }
      }
      if (v.length > cursor) {
        h += v.substring(cursor, v.length);
      }
      return h;
    }
    return v;
  }
});