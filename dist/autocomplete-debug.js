define("#autocomplete/0.8.0/data-source-debug", ["#base/1.0.0/base-debug", "#class/1.0.0/class-debug", "#events/1.0.0/events-debug", "$-debug"], function(require, exports, module) {

    var Base = require('#base/1.0.0/base-debug');
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
            var that = this;
            var url = this.get('source')
                .replace(/{{query}}/g, query ? query : '');
            $.ajax(url, {
                dataType: 'jsonp'
            }).success(function(data) {
                that.trigger('data', data);
            }).error(function(data) {
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



define("#autocomplete/0.8.0/filter-debug", ["$-debug"], function(require, exports, module) {

    var $ = require('$-debug');

    var Filter = {
        startsWith: function(data, query) {
            var result = [], l = query.length,
                reg = new RegExp('^' + query),
                highlightIndex = (l === 1 ? [0] : [[0, l]]);
            $.each(data, function(index, value) {
                var o = {};
                if (reg.test(value)) {
                    o.value = value;
                    o.highlightIndex = highlightIndex;
                    result.push(o);
                }
            });
            return result;
        }
    };

    module.exports = Filter;
});




define("#autocomplete/0.8.0/autocomplete-debug", ["./data-source-debug", "./filter-debug", "$-debug", "#overlay/0.9.9/overlay-debug", "#position/1.0.0/position-debug", "#iframe-shim/1.0.0/iframe-shim-debug", "#widget/1.0.0/widget-debug", "#base/1.0.0/base-debug", "#class/1.0.0/class-debug", "#events/1.0.0/events-debug", "#widget/1.0.0/templatable-debug", "#handlebars/1.0.0/handlebars-debug"], function(require, exports, module) {

    var $ = require('$-debug');
    var Overlay = require('#overlay/0.9.9/overlay-debug');
    var Templatable = require('#widget/1.0.0/templatable-debug');
    var Handlebars = require('#handlebars/1.0.0/handlebars-debug');
    var DataSource = require('./data-source-debug');
    var Filter = require('./filter-debug');

    var template = '<div class="{{classPrefix}}"><ul class="{{classPrefix}}-ctn" data-role="items">{{#each items}}<li data-role="item" class="{{../classPrefix}}-item" data-value="{{value}}">{{highlightItem ../classPrefix}}</li>{{/each}}</ul></div>';

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
            filter: 'startsWith', // 输出过滤
            inputFilter: defaultInputFilter, // 输入过滤
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
            highlightItem: function(classPrefix) {
                var index = this.highlightIndex,
                    cursor = 0, v = this.value, h = '';
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
                        if (start - cursor > 0) {
                            h += v.substring(cursor, start);
                        }
                        h += '<span class="' + classPrefix + '-item-hl">' +
                            v.substr(start, length) +
                            '</span>';
                        cursor = start + length;
                    }
                    if (v.length - cursor > 0) {
                        h += v.substring(cursor, v.length);
                    }
                    return new Handlebars.SafeString(h);
                }
                return this.value;
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
            this.dataSource = new DataSource({
                source: this.get('dataSource')
            }).on('data', this._filterData, this);
        },

        setup: function() {
            AutoComplete.superclass.setup.call(this);

            var trigger = this.get('trigger'), that = this;
            trigger.on('keyup.autocomplete', function(e) {
                // 获取输入的值
                var v = that.get('trigger').val(),
                    oldInput = that.get('inputValue');

                that.set('inputValue', v);

                // 如果输入为空，则清空并隐藏
                if (!v) {
                    that.hide();
                    that._clear();
                    return;
                }

                // 如果输入变化才显示
                if (oldInput !== v) {
                    that.show();
                }
            }).on('keydown.autocomplete', function(e) {
                var currentIndex = that.get('selectedIndex');

                switch (e.which) {
                    // top arrow
                    case KEY.UP:
                        e.preventDefault();
                        if (!that.get('visible')) {
                            that.show();
                            return;
                        }
                        if (currentIndex > 0) {
                            that.set('selectedIndex', currentIndex - 1);
                        } else {
                            that.set('selectedIndex', that.items.length - 1);
                        }
                        break;

                    // bottom arrow
                    case KEY.DOWN:
                        e.preventDefault();
                        if (!that.get('visible')) {
                            that.show();
                            return;
                        }
                        if (currentIndex < that.items.length - 1) {
                            that.set('selectedIndex', currentIndex + 1);
                        } else {
                            that.set('selectedIndex', 0);
                        }
                        break;

                    // left arrow
                    case KEY.LEFT:
                        break;

                    // right arrow
                    case KEY.RIGHT:
                        that.selectItem();
                        break;

                    // enter
                    case KEY.ENTER:
                        // 是否阻止回车提交表单
                        if (!that.get('submitOnEnter')) {
                            e.preventDefault();
                        }
                        if (!that.get('visible')) {
                            return false;
                        }
                        that.selectItem();
                        break;
                }
            }).on('blur.autocomplete', function(e) {
                that.hide();
            }).attr('autocomplete', 'off');

            this._tweakAlignDefaultValue();
        },

        selectItem: function() {
            this.get('trigger').focus();
            this.hide();

            var item = this.currentItem;
            if (item) {
                var value = item.attr('data-value');
                this.get('trigger').val(value);
                this.set('inputValue', value);
                this.trigger('itemSelect', value);
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
            var filter = this.get('filter'),
                locator = this.get('locator');

            // 获取目标数据
            data = locateResult(locator, data);

            // 如果 filter 不是 `function`，则从组件内置的 FILTER 获取
            if (!$.isFunction(filter)) {
                filter = Filter[filter];
            }
            if (filter && $.isFunction(filter)) {
                data = filter.call(this, data, this.realValue);
            } else {
                data = defaultOutputFilter.call(this, data);
            }
            this.set('data', data);
        },

        _clear: function(attribute) {
            this.$('[data-role=items]').empty();
            this.items = null;
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
                this.hide();
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

            this.trigger('indexChange', index);
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

    function defaultOutputFilter(data) {
        var result = [];
        $.each(data, function(index, value) {
            result.push({value: value});
        });
        return result;
    }
});
