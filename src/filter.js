define(function(require, exports, module) {

    var $ = require('$');

    var Filter = {
        startsWith: function(data, query) {
            var result = [], l = query.length,
                reg = new RegExp('^' + query);
            $.each(data, function(index, value) {
                var o = {};
                if (reg.test(value)) {
                    o.value = value;
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


