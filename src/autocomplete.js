define(function(require, exports, module) {

    var $ = require('$');
    var Overlay = require('overlay');
    var Templatable = require('templatable');
    var Handlebars = require('handlebars');
    var DataSource = require('./data-source');
    var Filter = require('./filter');

    var template = require('./autocomplete.tpl')

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

    var Autocomplete = Overlay.extend({

        Implements: Templatable,

        attrs: {
            // 触发元素
            trigger: {
                value: null, // required
                getter: function(val) {
                    return $(val);
                }
            },
            prefix: 'ui-autocomplete',
            // 默认模版和数据
            template: template,
            filter: 'startsWith',
            resultsLocator:'',
            selectedIndex: undefined,
            // TODO 是否循环选择
            circular: false,
            // 数据源，支持 Array, URL
            // TODO Object, Function
            dataSource: [],
            // 以下仅为组件使用
            inputValue: '',
            data: {}
        },

        events: {
            'click [data-role=item]': function(e) {
                this.selectItem();
                e.preventDefault();
            },
            'mouseenter [data-role=item]': function(e) {
                var i = this.items.index(e.currentTarget);
                this.set('selectedIndex', i);
            }
        },

        templateHelpers: {
            // 将匹配的高亮文字加上 hl 的样式
            highlightItem: function(prefix) {
                var index = this.highlightIndex, cursor = 0, v = this.value, h = '';
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
                        if (start -  cursor > 0) {
                            h += v.substring(cursor, start);
                        }
                        h += '<span class="' + prefix +  '-item-hl">' + v.substr(start, length) + '</span>';
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
                prefix: this.get('prefix'),
                items: []
            };

            Autocomplete.superclass.parseElement.call(this);
        },

        initProps: function(attribute) {
            this.dataSource = new DataSource({
                source: this.get('dataSource')
            }).on('data', this._filterData, this);
        },

        setup: function() {
            Autocomplete.superclass.setup.call(this);

            var trigger = this.get('trigger'), that = this;
            trigger.on('keyup.autocomplete', function(e) {
                // 获取输入的值
                var v = that._getCurrentValue();
                that.set('inputValue', v);
            }).on('keydown.autocomplete', function(e) {
                var currentIndex = that.get('selectedIndex');

                switch (e.which) {
                    // top arrow
                    case KEY.UP:
                        e.preventDefault();
                        (currentIndex > 0) && that.set('selectedIndex', currentIndex - 1);
                        break;

                    // bottom arrow
                    case KEY.DOWN:
                        e.preventDefault();
                        (currentIndex < that.items.length - 1) && that.set('selectedIndex', currentIndex + 1);
                        break;

                    // left arrow
                    case KEY.LEFT:
                        break;

                    // right arrow
                    case KEY.RIGHT:
                        break;

                    // enter
                    case KEY.ENTER:
                        that.selectItem();
                        break;
                }

            }).on('focus.autocomplete', function(e) {

            }).on('blur.autocomplete', function(e) {
                // 当选中某一项时，输入框的焦点会移向浮层，这时也会触发 blur 事件
                // blur 优先于 click，浮层隐藏了就无法选中了，所以 400ms 后再触发
                setTimeout(function () {
                    that.hide();
                }, 400);
            }).attr('autocomplete', 'off');

            this._tweakAlignDefaultValue();
        },

        selectItem: function() {
            var value = this.currentItem.data('value');
            this.get('trigger').val(value);
            this.set('inputValue', value);
            this.get('trigger').focus();
            this.trigger('item_selected', value);
            this.hide();
        },

        // 调整 align 属性的默认值
        _tweakAlignDefaultValue: function() {
            var align = this.get('align');

            // 默认坐标在目标元素左下角
            if (align.baseXY.toString() === [0, 0].toString()) {
                align.baseXY = [0, '100%'];
            }

            // 默认基准定位元素为 trigger
            if (align.baseElement._id === 'VIEWPORT') {
                align.baseElement = this.get('trigger');
            }

            this.set('align', align);
        },

        _getCurrentValue: function() {
            return this.get('trigger').val();
        },

        // 过滤数据
        _filterData: function(data) {
            var filter = this.get('filter'),
                source = this.dataSource,
                locator = this.get('resultsLocator');

            // 如果是异步请求，则需要通过 resultsLocator 找到需要的数据
            if (source.get('type') === 'url') {
                data = locateResult(locator, data);
            }

            // 如果 filter 不是 `function`，则从组件内置的 FILTER 获取
            if (!$.isFunction(filter)) {
                filter = Filter[filter];
            }
            if (filter && $.isFunction(filter)) {
                data = filter.call(this, this.get('inputValue'), data);
            }
            this.set('data', data);
        },

        _onRenderInputValue: function(val) {
            // 两种情况下会不显示下拉框
            // 1. 设置的值为空
            // 2. 设置的值和输入框中的相同
            if (!val && this.get('trigger').val() === val) {
                this.hide();
                return;
            }
            // 根据输入值获取数据
            this.dataSource.getData(val);
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
            this.set('selectedIndex', 0);

            this.show();
        },

        _onRenderSelectedIndex: function(val) {
            if (val === -1) return;
            var className = this.get('prefix') + '-item-hover';
            if (this.currentItem) {
                this.currentItem.removeClass(className);
            }
            this.currentItem = this.items
                .eq(val)
                .addClass(className);
            
            this.show();
        },
    });

    module.exports = Autocomplete;

    function isString(str) {
        return Object.prototype.toString.call(str) === '[object String]';
    }
    
    // 通过 locator 找到 data 中的某个属性的值
    // locator 支持 function，函数返回值为结果
    // locator 支持 string，而且支持点操作符寻址
    //     data {
    //       a: {
    //         b: 'c'
    //       }
    //     }
    //     locator 'a.b'
    // 最后的返回值为 c
    function locateResult (locator, data) {
        if (!locator) {
            return data;
        }
        if ($.isFunction(locator)) {
            return locator.call(this, data);
        } else if (isString(locator)) {
            var s = locator.split('.'), p = data, o;
            while (s.length) {
                var v = s.shift();
                p = p[v];
                if (!p) {
                    break;
                }
            }
            return p;
        }
        return data;
    }

});
