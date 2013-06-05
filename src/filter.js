define(function(require, exports, module) {

    var $ = require('$');

    var Filter = {
        'default': function(data) {return data;},

        'startsWith': function(data, query) {
            query = query || '';
            var result = [], l = query.length,
                reg = new RegExp('^' + escapeKeyword(query));

            if (!l) return [];

            $.each(data, function(index, item) {
                var a, matchKeys = [item.value].concat(item.alias);

                // 匹配 value 和 alias 中的
                while(a = matchKeys.pop()) {
                    if (reg.test(a)) {
                        result.push(item);
                        break;
                    }
                }
            });
            return result;
        },


        'stringMatch': function(data, query) {
            query = query || '';
            var result = [], l = query.length;

            if (!l) return [];

            $.each(data, function(index, item) {
                var a, matchKeys = [item.value].concat(item.alias);

                // 匹配 value 和 alias 中的
                while(a = matchKeys.pop()) {
                    if (a.indexOf(query) > -1) {
                        result.push(item);
                        break;
                    }
                }
            });
            return result;
        }
    };

    module.exports = Filter;

    // 转义正则关键字
    var keyword = /(\[|\[|\]|\^|\$|\||\(|\)|\{|\}|\+|\*|\?)/g;
    function escapeKeyword (str) {
      return (str || '').replace(keyword, '\\$1');
    }
});


