define(function(require, exports, module) {

    var $ = require('$');

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


