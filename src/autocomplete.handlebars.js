define("arale/autocomplete/1.3.0/autocomplete.handlebars", [ "gallery/handlebars/1.0.2/runtime" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        partials = partials || Handlebars.partials;
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data, depth1) {
            var buffer = "", stack1, stack2;
            buffer += '\n    <li data-role="item" class="' + escapeExpression((stack1 = depth1.classPrefix, 
            typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '-item">';
            stack2 = self.invokePartial(partials.html, "html", depth0, helpers, partials, data);
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "</li>\n  ";
            return buffer;
        }
        buffer += '<div class="';
        if (stack1 = helpers.classPrefix) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.classPrefix;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '">\n  ';
        stack1 = self.invokePartial(partials.header, "header", depth0, helpers, partials, data);
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\n  <ul class="';
        if (stack1 = helpers.classPrefix) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.classPrefix;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '-ctn" data-role="items">\n  ';
        stack1 = helpers.each.call(depth0, depth0.items, {
            hash: {},
            inverse: self.noop,
            fn: self.programWithDepth(1, program1, data, depth0),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n  </ul>\n  ";
        stack1 = self.invokePartial(partials.footer, "footer", depth0, helpers, partials, data);
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n</div>\n";
        return buffer;
    });
});
