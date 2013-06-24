define(function(require, exports, module) {

    var $ = require('$');
    var Overlay = require('overlay');
    var Templatable = require('templatable');
    var DataSource = require('./data-source');
    var Filter = require('./filter');

    var template = require('./autocomplete.handlebars');

    var isIE = (window.navigator.userAgent || "").toLowerCase().indexOf("msie") !== -1;

    // keyCode
    var KEY = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        ENTER: 13,
        ESC: 27,
        BACKSPACE: 8
    };

    var AutoComplete = Overlay.extend({

        Implements: Templatable,

        attrs: {
            // 触发元素
            trigger: {
                value: null, // required
                getter: function(val) {
                    return $(val);
                }
            },
            classPrefix: 'ui-autocomplete',
            align: {
                baseXY: [0, '100%']
            },
            template: template,
            submitOnEnter: true, // 回车是否会提交表单
            selectItem: true, // 选中时是否调用 selectItem 方法
            dataSource: [], //数据源，支持 Array, URL, Object, Function
            locator: 'data',
            filter: undefined, // 输出过滤
            inputFilter: function(v) {return v;}, // 输入过滤
            disabled: false,
            selectFirst: false,
            delay: 100,
            // 以下仅为组件使用
            selectedIndex: undefined,
            inputValue: null, // 同步输入框的 value
            data: null
        },

        events: {
            // mousedown 先于 blur 触发，选中后再触发 blur 隐藏浮层
            // see _blurEvent
            'mousedown [data-role=item]': function(e) {
                var i = this.items.index(e.currentTarget);
                this.set('selectedIndex', i);

                if (this.get('selectItem')) {
                    this.selectItem();
                    this._firstMousedown = true;
                }
            },
            'mousedown': function() {
                this._secondMousedown = true;
            },
            'click [data-role=item]': function() {
                // 在非 selectItem 时隐藏浮层 
                if (!this.get('selectItem')) {
                    this.hide();
                }
            },
            'mouseenter [data-role=item]': function(e) {
                var className = this.get('classPrefix') + '-item-hover';
                if (this.currentItem) this.currentItem.removeClass(className);
                $(e.currentTarget).addClass(className);
            },
            'mouseleave [data-role=item]': function(e) {
                var className = this.get('classPrefix') + '-item-hover';
                $(e.currentTarget).removeClass(className);
            }
        },

        templateHelpers: {
            // 将匹配的高亮文字加上 hl 的样式
            highlightItem: highlightItem
        },

        parseElement: function() {
            this.set("model", {
                classPrefix: this.get('classPrefix'),
                items: []
            });
            AutoComplete.superclass.parseElement.call(this);
        },

        setup: function() {
            var trigger = this.get('trigger'), that = this;

            AutoComplete.superclass.setup.call(this);

            // 初始化数据源
            this.dataSource = new DataSource({
                source: this.get('dataSource')
            }).on('data', this._filterData, this);

            this._initFilter(); // 初始化 filter
            this._blurHide([trigger]);
            this._tweakAlignDefaultValue();

            trigger.attr('autocomplete', 'off');
            this.delegateEvents(trigger, 'blur.autocomplete', $.proxy(this._blurEvent, this));
            this.delegateEvents(trigger, 'keydown.autocomplete', $.proxy(this._keydownEvent, this));
            this.delegateEvents(trigger, 'keyup.autocomplete', function() {
                    clearTimeout(that._timeout);
                    that._timeout = setTimeout(function() {
                        that._timeout = null;
                        that._keyupEvent.call(that);
                    }, that.get('delay'));
                });

        },

        destroy: function() {
            this._clear();
            this.element.remove();
            AutoComplete.superclass.destroy.call(this);
        },

        hide: function() {
            // 隐藏的时候取消请求或回调
            if (this._timeout) clearTimeout(this._timeout);
            this.dataSource.abort();
            AutoComplete.superclass.hide.call(this);
        },

        // Public Methods
        // --------------

        selectItem: function() {
            this.hide();

            var item = this.currentItem,
                index = this.get('selectedIndex'),
                data = this.get('data')[index];

            if (item) {
                var matchKey = item.attr('data-value');
                this.get('trigger').val(matchKey);
                this.set('inputValue', matchKey, {silent: true});
                this.trigger('itemSelect', data);
                this._clear();
            }
        },

        setInputValue: function(val) {
            if (this.get('inputValue') !== val) {
                // 进入处理流程
                this._start = true;
                this.set('inputValue', val);
                // 避免光标移动到尾部 #44
                var trigger = this.get('trigger');
                if (trigger.val() !== val) {
                    trigger.val(val);
                }
            }
        },

        // Private Methods
        // ---------------

        // 1. 判断输入值，调用数据源
        _onRenderInputValue: function(val) {
            if (this._start && val) {
                var oldQueryValue = this.queryValue;
                this.queryValue = this.get('inputFilter').call(this, val);
                // 如果 query 为空或者相等则不处理
                if (this.queryValue && this.queryValue !== oldQueryValue) {
                    this.dataSource.abort();
                    this.dataSource.getData(this.queryValue);
                }
            } else {
                this.queryValue = '';
            }
            if (val === '' || !this.queryValue) {
                this.set('data', []);
                this.hide();
            }
            delete this._start;
        },

        // 2. 数据源返回，过滤数据
        _filterData: function(data) {
            var filter = this.get('filter'),
                locator = this.get('locator');

            // 获取目标数据
            data = locateResult(locator, data);

            // 进行过滤
            data = filter.func.call(this, data, this.queryValue, filter.options);

            this.set('data', data);
        },

        // 3. 通过数据渲染模板
        _onRenderData: function(data) {
            // 清除状态
            this._clear();

            // 渲染下拉
            this.set("model", {
                items: data
            });

            this.renderPartial('[data-role=items]');

            // 初始化下拉的状态
            this.items = this.$('[data-role=items]').children();
            this.currentItem = null;

            if (this.get('selectFirst')) {
                this.set('selectedIndex', 0);
            }

            // data-role=items 无内容才隐藏
            if ($.trim(this.$('[data-role=items]').text())) {
                this.show();
            } else {
                this.hide();
            }
        },

        // 键盘控制上下移动
        _onRenderSelectedIndex: function(index) {
            if (index === -1) return;
            var className = this.get('classPrefix') + '-item-hover';
            if (this.currentItem) {
                this.currentItem.removeClass(className);
            }
            this.currentItem = this.items
                .eq(index)
                .addClass(className);

            this.trigger('indexChange', index, this.lastIndex);
            this.lastIndex = index;
        },

        _initFilter: function() {
            var filter = this.get('filter');

            // 设置 filter 的默认值
            if (filter === undefined) {
                // 异步请求的时候一般不需要过滤器
                if (this.dataSource.get('type') === 'url') {
                    filter = null;
                } else {
                    filter = {
                        name: 'startsWith',
                        func: Filter['startsWith'],
                        options: {
                            key: 'value'
                        }
                    };
                }
            } else {
                // object 的情况
                // {
                //   name: '',
                //   options: {}
                // }
                if ($.isPlainObject(filter)) {
                    if (Filter[filter.name]) {
                        filter = {
                            name: filter.name,
                            func: Filter[filter.name],
                            options: filter.options
                        };
                    } else {
                        filter = null;
                    }
                } else if ($.isFunction(filter)) {
                    filter = {
                        func: filter
                    };
                } else {
                    // 从组件内置的 FILTER 获取
                    if (Filter[filter]) {
                        filter = {
                            name: filter,
                            func: Filter[filter]
                        };
                    } else {
                        filter = null;
                    }
                }
            }
            // filter 为 null，设置为 default
            if (!filter) {
                filter = {
                    name: 'default',
                    func: Filter['default']
                };
            }
            this.set('filter', filter);
        },

        _blurEvent: function() {
            if (isIE) return;

            // https://github.com/aralejs/autocomplete/issues/26
            if (!this._secondMousedown) {
                this.hide();
            } else if (this._firstMousedown) {
                this.get('trigger').focus();
                this.hide();
            }
            delete this._firstMousedown;
            delete this._secondMousedown;
        },

        _keyupEvent: function() {
            if (this.get('disabled')) return;

            if (this._keyupStart) {
                delete this._keyupStart;
                // 获取输入的值
                var v = this.get('trigger').val();
                this.setInputValue(v);
            }
        },

        _keydownEvent: function(e) {
            if (this.get('disabled')) return;

            // 先清空状态
            delete this._keyupStart;

            switch (e.which) {
                case KEY.ESC:
                    this.hide();
                    break;

                // top arrow
                case KEY.UP:
                    this._keyUp(e);
                    break;

                // bottom arrow
                case KEY.DOWN:
                    this._keyDown(e);
                    break;

                // left arrow
                case KEY.LEFT:
                // right arrow
                case KEY.RIGHT:
                    break;

                // enter
                case KEY.ENTER:
                    this._keyEnter(e);
                    break;

                // default 继续执行 keyup
                default:
                    this._keyupStart = true;
            }
        },

        _keyUp: function(e) {
            e.preventDefault();
            if (this.get('data').length) {
                if (!this.get('visible')) {
                    this.show();
                    return;
                }
                this._step(-1);
            }
        },

        _keyDown: function(e) {
            e.preventDefault();
            if (this.get('data').length) {
                if (!this.get('visible')) {
                    this.show();
                    return;
                }
                this._step(1);
            }
        },

        _keyEnter: function(e) {
            if (this.get('visible')) {
                this.selectItem();

                // 是否阻止回车提交表单
                if (!this.get('submitOnEnter')) {
                    e.preventDefault();
                }
            }
        },

        // 选项上下移动
        _step: function(direction) {
            var currentIndex = this.get('selectedIndex');
            if (direction === -1) { // 反向
                if (currentIndex > 0) {
                    this.set('selectedIndex', currentIndex - 1);
                } else {
                    this.set('selectedIndex', this.items.length - 1);
                }
            } else if (direction === 1) { // 正向
                if (currentIndex < this.items.length - 1) {
                    this.set('selectedIndex', currentIndex + 1);
                } else {
                    this.set('selectedIndex', 0);
                }
            }
        },

        _clear: function() {
            this.$('[data-role=items]').empty();
            this.set('selectedIndex', -1);
            delete this.items;
            delete this.lastIndex;
            delete this.currentItem;
        },

        // 调整 align 属性的默认值
        _tweakAlignDefaultValue: function() {
            var align = this.get('align');
            align.baseElement = this.get('trigger');
            this.set('align', align);
        }


    });

    // 以便写测试用例
    AutoComplete._filter = Filter;

    module.exports = AutoComplete;


    function isString(str) {
        return Object.prototype.toString.call(str) === '[object String]';
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
            var s = locator.split('.'), p = data;
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

    function highlightItem(classPrefix, matchKey) {
        var index = this.highlightIndex,
            cursor = 0, v = matchKey || this.matchKey || '', h = '';
        if ($.isArray(index)) {
            for (var i = 0, l = index.length; i < l; i++) {
                var j = index[i], start, length;
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
                    h += '<span class="' + classPrefix + '-item-hl">' +
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
