define(function(require, exports, module) {

    var $ = require('$');

    var Filter = {
        'default': function(data, query, options) {
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

        // options: {
        //   key: 'value'
        // }
        'startsWith': function(data, query, options) {
            var result = [], l = query.length,
                reg = new RegExp('^' + escapeKeyword(query));

            if (!l) return [];

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
        },


        'stringMatch': function(data, query, options) {
            query = query || '';
            var result = [], l = query.length;

            if (!l) return [];

            $.each(data, function(index, item) {
                var o = {}, matchKey = getMatchKey(item, options);

                if ($.isPlainObject(item)) {
                    o = $.extend({}, item);
                }

                if (matchKey.indexOf(query) > -1) {
                    o.matchKey = matchKey;
                    o.highlightIndex = stringMatch(matchKey, query);
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
            var key = (options && options.key) || 'value'; 
            return item[key] || '';
        } else {
            return item;
        }
    }

    function stringMatch(matchKey, query) {
        var r = [], a = matchKey.split('');
        var queryIndex = 0, q = query.split('');
        for (var i = 0, l = a.length; i < l; i++) {
            var v = a[i];
            if (v == q[queryIndex]) {
                if (queryIndex === q.length -1) {
                    r.push([i - q.length + 1,i + 1]);
                    queryIndex = 0;
                    continue;
                }
                queryIndex++;
            } else {
                queryIndex = 0;
            }
        }
        return r;
    }

    // 转义正则关键字
    var keyword = /(\[|\[|\]|\^|\$|\||\(|\)|\{|\}|\+|\*|\?)/g;
    function escapeKeyword (str) {
      return (str || '').replace(keyword, '\\$1');
    }
});


