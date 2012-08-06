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
            } else {
                throw 'Source Type Error';
            }
        },

        getData: function(value, callback) {
            return this['_get' + capitalize(this.get('type')) + 'Data']();
        },

        _getUrlData : function(query) {
            var url = this.get('source')
                .replace(/{{query}}/g, query ? query : '');
            $.ajax(url, {
                dataType: 'jsonp'
            }).success(function(data) {
                this.trigger('data', data);
            }).error(function(data) {

            });
        },

        _getArrayData : function() {
            var source = this.get('source');
            this.trigger('data', source);
            return source;
        },

        // TODO 暂时没需求
        _getObjectData : function(query) {
            
        },
        _getFunctionData : function(query) {
            
        }

    });


    module.exports = DataSource;

    function isString(str) {
        return Object.prototype.toString.call(str) === '[object String]';
    }

    function capitalize (str) {
        if (!str) {
            return '';
        }
        return str.replace(
            /^([a-z])/,
            function(f, m){
                return m.toUpperCase();
            }
        );
    }
});

