define(function(require, exports, module) {

    var $ = require('$');

    var Filter = {
        startsWith: function(data, query, options) {
            var result = [], l = query.length,
                reg = new RegExp('^' + query);
            $.each(data, function(index, item) {
                var matchKey = '', o = {};

                if ($.isPlainObject(item)) {
                    matchKey = item[options.key] || '';
                    o = $.extend({}, item);
                } else {
                    matchKey = item;
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
});


