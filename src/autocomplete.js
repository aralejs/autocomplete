define(function(require, exports, module) {

    var Overlay = require('overlay');
    var Templatable = require('templatable');
    var $ = require('$');
    var DataSource = require('./data-source');
    var Filter = require('./filter');

    var template = require('./autocomplete.tpl')

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
            // 数据源，支持 Array, URL
            // TODO Object, Function
            dataSource: [],
            // 以下仅为组件使用
            inputValue: '',
            data: {}
        },

        templateHelpers: {
            highlightItem: function() {
                return this.value;
            }
        },

        parseElement: function() {
            this.model = {
                prefix: this.get('prefix'),
                list: []
            };

            Autocomplete.superclass.parseElement.call(this);
        },

        initProps: function(attribute) {
            this.dataSource = new DataSource({
                source: this.get('dataSource')
            }).on('data', this._filterData, this);
        },

        setup: function() {
            var trigger = this.get('trigger'), that = this;

            trigger.on('keyup', function(e) {
                // 获取输入的值
                var v = that._getCurrentValue();
                this.set('inputValue', v);
            }).on('focus', function(e) {

            }).on('blur', function(e) {

            });
        },

        _getCurrentValue: function() {
            return this.get('trigger').val();
        },

        // 过滤数据
        _filterData: function(data) {
            var filter = this.get('filter'),
                source = this.dataSource,
                locator = this.get('resultsLocator');

            if (source.get('type') === 'url') {
                // 如果是异步请求，则需要通过 resultsLocator 找到需要的数据
                data = locateResult(locator, data);
            }

            // 如果 filter 不是 `function`，则从组件内置的 FILTER 获取
            if (!$.isFunction(filter)) {
                filter = Filter[filter];
            }
            if (filter && $.isFunction(filter)) {
                data = filter.call(this, query, data);
            }
            this.set('data', data);
        },

        _onRenderInputValue: function(val) {
            // 根据输入值获取数据
            this.dataSource.getData(val);
        },

        _onRenderData: function(val) {
            this.model.list = val;
            this.renderPartial('[data-role=list]');
            this.show();
        }
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
