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
            // 数据源，支持 Array, URL
            // TODO Object, Function
            dataSource: [],
            // 以下仅为组件使用
            inputValue: '',
            data: {}
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
            var filter = this.get('filter');
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

});
