define(function(require, exports, module) {
  var Base = require('base');
  var $ = require('$');

  var DataSource = Base.extend({

    attrs: {
      source: null,
      type: 'array'
    },

    initialize: function(config) {
      DataSource.superclass.initialize.call(this, config);

      // 每次发送请求会将 id 记录到 callbacks 中，返回后会从中删除
      // 如果 abort 会清空 callbacks，之前的请求结果都不会执行
      this.id = 0;
      this.callbacks = [];

      var source = this.get('source');
      if (isString(source)) {
        this.set('type', 'url');
      } else if ($.isArray(source)) {
        this.set('type', 'array');
      } else if ($.isPlainObject(source)) {
        this.set('type', 'object');
      } else if ($.isFunction(source)) {
        this.set('type', 'function');
      } else {
        throw new Error('Source Type Error');
      }
    },

    getData: function(query) {
      return this['_get' + capitalize(this.get('type') || '') + 'Data'](query);
    },

    abort: function() {
      this.callbacks = [];
    },

    // 完成数据请求，getData => done
    _done: function(data) {
      this.trigger('data', data);
    },

    _getUrlData: function(query) {
      var that = this,
        options;
      var obj = {
        query: query ? encodeURIComponent(query) : '',
        timestamp: new Date().getTime()
      };
      var url = this.get('source')
        .replace(/\{\{(.*?)\}\}/g, function(all, match) {
          return obj[match];
        });

      var callbackId = 'callback_' + this.id++;
      this.callbacks.push(callbackId);

      if (/^(https?:\/\/)/.test(url)) {
        options = {
          dataType: 'jsonp'
        };
      } else {
        options = {
          dataType: 'json'
        };
      }
      $.ajax(url, options)
        .success(function(data) {
          if ($.inArray(callbackId, that.callbacks) > -1) {
            delete that.callbacks[callbackId];
            that._done(data);
          }
        })
        .error(function() {
          if ($.inArray(callbackId, that.callbacks) > -1) {
            delete that.callbacks[callbackId];
            that._done({});
          }
        });
    },

    _getArrayData: function() {
      var source = this.get('source');
      this._done(source);
      return source;
    },

    _getObjectData: function() {
      var source = this.get('source');
      this._done(source);
      return source;
    },

    _getFunctionData: function(query) {
      var that = this,
        func = this.get('source');
      // 如果返回 false 可阻止执行

      function done(data) {
        that._done(data);
      }
      var data = func.call(this, query, done);
      if (data) {
        this._done(data);
      }
    }
  });

  module.exports = DataSource;

  function isString(str) {
    return Object.prototype.toString.call(str) === '[object String]';
  }

  function capitalize(str) {
    return str.replace(
      /^([a-z])/,
      function(f, m) {
        return m.toUpperCase();
      }
    );
  }
});
