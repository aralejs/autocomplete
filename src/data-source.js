define(function(require, exports, module) {

    var Base = require('base');
    var $ = require('$');

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

