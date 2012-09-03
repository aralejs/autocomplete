define(function(require, exports, module) {

    var Base = require('base');
    var $ = require('$');

    var DataSource = Base.extend({

        attrs: {
            source: [],
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
            this.trigger('data', func.call(this, query));
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

