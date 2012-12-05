define(function(require, exports, module) {

    var $ = require('$');
    var AutoComplete = require('./autocomplete');

    var TextareaComplete = AutoComplete.extend({

        _keyEnter: function(e) {
            // 如果没有选中任一一项也不会阻止
            if (this.get('visible') && this.currentItem) {
                e.preventDefault();
                e.stopImmediatePropagation(); // 阻止冒泡及绑定的其他 keydown 事件

                this.selectItem();
            }
        },

        // TODO: 使用 selection
        selectItem: function() {
            TextareaComplete.superclass.selectItem.call(this);
        }
    });

    module.exports = TextareaComplete;
});
















































