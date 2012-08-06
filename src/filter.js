define(function(require, exports, module) {

    var $ = require('$');

    var Filter = {
        startsWith = function(query, data) {
            var result = [], reg = new RegExp('^' + query);
            $.each(data, function(index, value) { 
                var o = {};
                if (reg.test(value)) {
                    o.value = value;
                    result.push(o);
                }
            });
            return data;
        }
    };

    module.exports = Filter;
});


