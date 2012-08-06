define(function(require, exports, module) {

    var $ = require('$');

    var Filter = {
        startsWith : function(query, data) {
            var result = [], l = query.length,
                reg = new RegExp('^' + query),
                highlightIndex = (l === 1 ? [0] : [[0, l]]);
            $.each(data, function(index, value) {
                var o = {};
                if (reg.test(value)) {
                    o.value = value;
                    o.highlightIndex = highlightIndex;
                    result.push(o);
                }
            });
            return result;
        }
    };

    module.exports = Filter;
});


