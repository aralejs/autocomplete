define("arale/autocomplete/0.9.0/data-source-debug", ["arale/base/1.0.1/base-debug", "arale/class/1.0.0/class-debug", "arale/events/1.0.0/events-debug", "$-debug"], function(require, exports, module) {

    var Base = require('arale/base/1.0.1/base-debug');
    var $ = require('$-debug');

    var DataSource = Base.extend({

        attrs: {
            source: null,
            type: 'array'
        },

        initialize: function(config) {
            DataSource.superclass.initialize.call(this, config);

            var source = this.get('source');
            if (isString(source)) {
                this.set('type', 'url');
            } else if ($.isArray(source)) {
                this.set('type', 'array');
            } else if ($.isPlainObject(source)) {
                this.set('type', 'object');
            } else if ($.isFunction(source)) {
                this.set('type', 'function');
            } else {
                throw new Error('Source Type Error');
            }
        },

        getData: function(query) {
            return this['_get' + capitalize(this.get('type')) + 'Data'](query);
        },

        _getUrlData: function(query) {
            var that = this, options;
            var url = this.get('source')
                .replace(/{{query}}/g, query ? query : '');
            if (/^(https?:\/\/)/.test(url)) {
                options = {dataType: 'jsonp'};
            } else {
                options = {dataType: 'json'};
            }
            $.ajax(url, options)
                .success(function(data) {
                    that.trigger('data', data);
                })
                .error(function(data) {
                    that.trigger('data', {});
                });
        },

        _getArrayData: function() {
            var source = this.get('source');
            this.trigger('data', source);
            return source;
        },

        _getObjectData: function(query) {
            var source = this.get('source');
            this.trigger('data', source);
            return source;
        },

        _getFunctionData: function(query) {
            var func = this.get('source');
            // 如果返回 false 可阻止执行
            var data = func.call(this, query);
            if (data) {
                this.trigger('data', data);
            }
        }
    });


    module.exports = DataSource;

    function isString(str) {
        return Object.prototype.toString.call(str) === '[object String]';
    }

    function capitalize(str) {
        if (!str) {
            return '';
        }
        return str.replace(
            /^([a-z])/,
            function(f, m) {
                return m.toUpperCase();
            }
        );
    }
});


define("arale/autocomplete/0.9.0/filter-debug", ["$-debug"], function(require, exports, module) {

    var $ = require('$-debug');

    var Filter = {
        default: function(data, query, options) {
            var result = [];
            $.each(data, function(index, item) {
                var o = {}, matchKey = getMatchKey(item, options);
                if ($.isPlainObject(item)) {
                    o = $.extend({}, item);
                }
                o.matchKey = matchKey;
                result.push(o);
            });
            return result;
        },

        startsWith: function(data, query, options) {
            var result = [], l = query.length,
                reg = new RegExp('^' + query);
            $.each(data, function(index, item) {
                var o = {}, matchKey = getMatchKey(item, options);

                if ($.isPlainObject(item)) {
                    o = $.extend({}, item);
                }
                // 生成 item
                // {
                //   ...   // self property
                //   matchKey: '', // 匹配的内容
                //   highlightIndex: [] // 高亮的索引
                // }
                if (reg.test(matchKey)) {
                    o.matchKey = matchKey;
                    if (l > 0) {
                        o.highlightIndex = [[0, l]];
                    }
                    result.push(o);
                }
            });
            return result;
        }
    };

    module.exports = Filter;

    function getMatchKey(item, options) {
        if ($.isPlainObject(item)) {
            // 默认取对象的 value 属性
            var key = options.key || 'value'; 
            return item[key] || '';
        } else {
            return item;
        }
    }
});



define("arale/autocomplete/0.9.0/autocomplete-debug", ["./data-source-debug", "./filter-debug", "$-debug", "arale/overlay/0.9.12/overlay-debug", "arale/position/1.0.0/position-debug", "arale/iframe-shim/1.0.0/iframe-shim-debug", "arale/widget/1.0.2/widget-debug", "arale/base/1.0.1/base-debug", "arale/class/1.0.0/class-debug", "arale/events/1.0.0/events-debug", "arale/widget/1.0.2/templatable-debug", "gallery/handlebars/1.0.0/handlebars-debug"], function(require, exports, module) {

    var $ = require('$-debug');
    var Overlay = require('arale/overlay/0.9.12/overlay-debug');
    var Templatable = require('arale/widget/1.0.2/templatable-debug');
    var Handlebars = require('gallery/handlebars/1.0.0/handlebars-debug');
    var DataSource = require('./data-source-debug');
    var Filter = require('./filter-debug');

    var template = '<div class="{{classPrefix}}"> <ul class="{{classPrefix}}-ctn" data-role="items"> {{#each items}} <li data-role="item" class="{{../classPrefix}}-item" data-value="{{matchKey}}">{{highlightItem ../classPrefix matchKey}}</li> {{/each}} </ul> </div>';

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
            dataSource: [], //数据源，支持 Array, URL, Object, Function
            locator: 'data',
            filter: undefined, // 输出过滤
            inputFilter: defaultInputFilter, // 输入过滤
            disabled: false,
            selectFirst: false,
            // 以下仅为组件使用
            selectedIndex: undefined,
            inputValue: '', // 同步输入框的 value
            data: []
        },

        events: {
            // mousedown 先于 blur 触发，选中后再触发 blur 隐藏浮层
            'mousedown [data-role=item]': function(e) {
                this.selectItem();
            },
            'mouseenter [data-role=item]': function(e) {
                var i = this.items.index(e.currentTarget);
                this.set('selectedIndex', i);
            }
        },

        templateHelpers: {
            // 将匹配的高亮文字加上 hl 的样式
            highlightItem: function(classPrefix, matchKey) {
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
                    return new Handlebars.SafeString(h);
                }
                return v;
            }
        },

        parseElement: function() {
            this.model = {
                classPrefix: this.get('classPrefix'),
                items: []
            };

            AutoComplete.superclass.parseElement.call(this);
        },

        initProps: function(attribute) {
            var ds = this.dataSource = new DataSource({
                source: this.get('dataSource')
            }).on('data', this._filterData, this);

            // 设置 filter 的默认值
            if (this.get('filter') === undefined) {
                // 异步请求的时候一般不需要过滤器
                if (ds.get('type') === 'url') {
                    this.set('filter', '');
                } else {
                    this.set('filter', {
                        name: 'startsWith',
                        options: {
                          key: 'value'
                        }
                    });
                }
            }
        },

        setup: function() {
            AutoComplete.superclass.setup.call(this);

            this._blurHide([this.get('trigger')]);
            this._tweakAlignDefaultValue();

            var trigger = this.get('trigger'), that = this;
            trigger
                .attr('autocomplete', 'off')
                .on('keydown.autocomplete', $.proxy(this._keydownEvent, this))
                .on('keyup.autocomplete', function() {
                    clearTimeout(that._timeout);
                    that._timeout = setTimeout(function() {
                        that._keyupEvent.call(that);
                    }, 300);
                });
        },

        show: function() {
            AutoComplete.superclass.show.call(this);
            this._setPosition();
        },

        destroy: function() {
            this.element.remove();
            AutoComplete.superclass.destroy.call(this);
        },

        selectItem: function() {
            this.get('trigger').focus();
            this.hide();

            var item = this.currentItem,
                data = this.get('data'),
                index = this.items.index(item);
            data = data.length ? data[index] : {};

            if (item) {
                var matchKey = item.attr('data-value');
                this.get('trigger').val(matchKey);
                this.oldInput = matchKey;
                this.set('inputValue', matchKey);
                this.trigger('itemSelect', matchKey, data);
            }
        },

        // 调整 align 属性的默认值
        _tweakAlignDefaultValue: function() {
            var align = this.get('align');
            align.baseElement = this.get('trigger');
            this.set('align', align);
        },

        // 过滤数据
        _filterData: function(data) {
            var filter = this.get('filter'), filterOptions = {},
                locator = this.get('locator');

            // 获取目标数据
            data = locateResult(locator, data);

            // object 的情况
            // {
            //   name: '',
            //   options: {}
            // }
            if ($.isPlainObject(filter)) {
                filterOptions = filter.options || {};
                filter = filter.name || '';
            }

            // 如果 filter 不是 `function`，则从组件内置的 FILTER 获取
            if (!$.isFunction(filter)) {
                filter = Filter[filter];
            }

            // 使用 default filter
            if (!(filter && $.isFunction(filter))) {
                filter = Filter['default'];
            }

            data = filter.call(this, data, this.realValue, filterOptions);
            this.set('data', data);
        },

        _keyupEvent: function() {
            if (this.get('disabled')) return;

            // 获取输入的值
            var v = this.get('trigger').val();

            this.oldInput = this.get('inputValue');
            this.set('inputValue', v);

            // 如果输入为空，则清空并隐藏
            if (!v) {
                this.hide();
                this.set('data', []);
            }
        },

        _keydownEvent: function(e) {
            if (this.get('disabled')) return;

            var currentIndex = this.get('selectedIndex');

            switch (e.which) {
                case KEY.ESC:
                    this.hide();
                    break;

                // top arrow
                case KEY.UP:
                    e.preventDefault();
                    if (!this.get('visible') && this.get('data').length) {
                        this.show();
                        return;
                    }
                    if (!this.items) {
                        return;
                    }
                    if (currentIndex > 0) {
                        this.set('selectedIndex', currentIndex - 1);
                    } else {
                        this.set('selectedIndex', this.items.length - 1);
                    }
                    break;

                // bottom arrow
                case KEY.DOWN:
                    e.preventDefault();
                    if (!this.get('visible') && this.get('data').length) {
                        this.show();
                        return;
                    }
                    if (!this.items) {
                        return;
                    }
                    if (currentIndex < this.items.length - 1) {
                        this.set('selectedIndex', currentIndex + 1);
                    } else {
                        this.set('selectedIndex', 0);
                    }
                    break;

                // left arrow
                case KEY.LEFT:
                // right arrow
                case KEY.RIGHT:
                    break;

                // enter
                case KEY.ENTER:
                    if (this.get('visible')) {
                        this.selectItem();

                        // 是否阻止回车提交表单
                        if (!this.get('submitOnEnter')) {
                            e.preventDefault();
                        }
                    }
                    break;
            }

        },

        _clear: function(attribute) {
            this.$('[data-role=items]').empty();
            delete this.items;
            delete this.lastIndex;
            delete this.currentItem;
            this.set('selectedIndex', -1);
        },

        _onRenderInputValue: function(val) {
            if (val) {
                this.realValue = this.get('inputFilter').call(this, val);
                this.dataSource.getData(this.realValue);
            }
        },

        _onRenderData: function(val) {
            // 渲染无数据则隐藏
            if (!val.length) {
                this._clear();
                this.hide();
                return;
            }
            // 如果输入变化才显示
            var v = this.get('inputValue');
            if (v === this.oldInput) {
                this._clear();
                return;
            }
            // 清除下拉状态
            this.items = null;
            this.set('selectedIndex', -1);

            // 渲染下拉
            this.model.items = val;
            this.renderPartial('[data-role=items]');

            // 初始化下拉的状态
            this.items = this.$('[data-role=items]').children();
            this.currentItem = null;

            if (this.get('selectFirst')) {
                this.set('selectedIndex', 0);
            }

            this.show();
            this.oldInput = v;
        },

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
        }
    });

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
            var s = locator.split('.'), p = data, o;
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

    function defaultInputFilter(v) {
        return v;
    }
});
