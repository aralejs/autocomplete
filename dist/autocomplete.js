define("arale/autocomplete/0.9.0/data-source",["arale/base/1.0.1/base","arale/class/1.0.0/class","arale/events/1.0.0/events","$"],function(e,t,n){function o(e){return Object.prototype.toString.call(e)==="[object String]"}function u(e){return e?e.replace(/^([a-z])/,function(e,t){return t.toUpperCase()}):""}var r=e("arale/base/1.0.1/base"),i=e("$"),s=r.extend({attrs:{source:null,type:"array"},initialize:function(e){s.superclass.initialize.call(this,e);var t=this.get("source");if(o(t))this.set("type","url");else if(i.isArray(t))this.set("type","array");else if(i.isPlainObject(t))this.set("type","object");else{if(!i.isFunction(t))throw new Error("Source Type Error");this.set("type","function")}},getData:function(e){return this["_get"+u(this.get("type"))+"Data"](e)},_getUrlData:function(e){var t=this,n,r=this.get("source").replace(/{{query}}/g,e?e:"");/^(https?:\/\/)/.test(r)?n={dataType:"jsonp"}:n={dataType:"json"},i.ajax(r,n).success(function(e){t.trigger("data",e)}).error(function(e){t.trigger("data",{})})},_getArrayData:function(){var e=this.get("source");return this.trigger("data",e),e},_getObjectData:function(e){var t=this.get("source");return this.trigger("data",t),t},_getFunctionData:function(e){var t=this.get("source"),n=t.call(this,e);n&&this.trigger("data",n)}});n.exports=s}),define("arale/autocomplete/0.9.0/filter",["$"],function(e,t,n){function s(e,t){if(r.isPlainObject(e)){var n=t.key||"value";return e[n]||""}return e}var r=e("$"),i={"default":function(e,t,n){var i=[];return r.each(e,function(e,t){var o={},u=s(t,n);r.isPlainObject(t)&&(o=r.extend({},t)),o.matchKey=u,i.push(o)}),i},startsWith:function(e,t,n){var i=[],o=t.length,u=new RegExp("^"+t);return r.each(e,function(e,t){var a={},f=s(t,n);r.isPlainObject(t)&&(a=r.extend({},t)),u.test(f)&&(a.matchKey=f,o>0&&(a.highlightIndex=[[0,o]]),i.push(a))}),i}};n.exports=i}),define("arale/autocomplete/0.9.0/autocomplete",["./data-source","./filter","$","arale/overlay/0.9.12/overlay","arale/position/1.0.0/position","arale/iframe-shim/1.0.0/iframe-shim","arale/widget/1.0.2/widget","arale/base/1.0.1/base","arale/class/1.0.0/class","arale/events/1.0.0/events","arale/widget/1.0.2/templatable","gallery/handlebars/1.0.0/handlebars"],function(e,t,n){function h(e){return Object.prototype.toString.call(e)==="[object String]"}function p(e,t){if(!e)return t;if(r.isFunction(e))return e.call(this,t);if(h(e)){var n=e.split("."),i=t,s;while(n.length){var o=n.shift();if(!i[o])break;i=i[o]}return i}return t}function d(e){return e}var r=e("$"),i=e("arale/overlay/0.9.12/overlay"),s=e("arale/widget/1.0.2/templatable"),o=e("gallery/handlebars/1.0.0/handlebars"),u=e("./data-source"),a=e("./filter"),f='<div class="{{classPrefix}}"> <ul class="{{classPrefix}}-ctn" data-role="items"> {{#each items}} <li data-role="item" class="{{../classPrefix}}-item" data-value="{{matchKey}}">{{highlightItem ../classPrefix matchKey}}</li> {{/each}} </ul> </div>',l={UP:38,DOWN:40,LEFT:37,RIGHT:39,ENTER:13,ESC:27,BACKSPACE:8},c=i.extend({Implements:s,attrs:{trigger:{value:null,getter:function(e){return r(e)}},classPrefix:"ui-autocomplete",align:{baseXY:[0,"100%"]},template:f,submitOnEnter:!0,dataSource:[],locator:"data",filter:{name:"startsWith",options:{key:"value"}},inputFilter:d,disabled:!1,selectFirst:!1,selectedIndex:undefined,inputValue:"",data:[]},events:{"mousedown [data-role=item]":function(e){this.selectItem()},"mouseenter [data-role=item]":function(e){var t=this.items.index(e.currentTarget);this.set("selectedIndex",t)}},templateHelpers:{highlightItem:function(e,t){var n=this.highlightIndex,i=0,s=t||this.matchKey||"",u="";if(r.isArray(n)){for(var a=0,f=n.length;a<f;a++){var l=n[a],c,h;r.isArray(l)?(c=l[0],h=l[1]-l[0]):(c=l,h=1),c>i&&(u+=s.substring(i,c)),c<s.length&&(u+='<span class="'+e+'-item-hl">'+s.substr(c,h)+"</span>"),i=c+h;if(i>=s.length)break}return s.length>i&&(u+=s.substring(i,s.length)),new o.SafeString(u)}return s}},parseElement:function(){this.model={classPrefix:this.get("classPrefix"),items:[]},c.superclass.parseElement.call(this)},initProps:function(e){var t=this.dataSource=(new u({source:this.get("dataSource")})).on("data",this._filterData,this);t.get("type")==="url"&&this.set("filter","")},setup:function(){c.superclass.setup.call(this),this._blurHide([this.get("trigger")]),this._tweakAlignDefaultValue();var e=this.get("trigger"),t=this;e.attr("autocomplete","off").on("keydown.autocomplete",r.proxy(this._keydownEvent,this)).on("keyup.autocomplete",function(){clearTimeout(t._timeout),t._timeout=setTimeout(function(){t._keyupEvent.call(t)},300)})},show:function(){c.superclass.show.call(this),this._setPosition()},destroy:function(){this.element.remove(),c.superclass.destroy.call(this)},selectItem:function(){this.get("trigger").focus(),this.hide();var e=this.currentItem,t=this.get("data"),n=this.items.index(e);t=t.length?t[n]:{};if(e){var r=e.attr("data-value");this.get("trigger").val(r),this.oldInput=r,this.set("inputValue",r),this.trigger("itemSelect",r,t)}},_tweakAlignDefaultValue:function(){var e=this.get("align");e.baseElement=this.get("trigger"),this.set("align",e)},_filterData:function(e){var t=this.get("filter"),n={},i=this.get("locator");e=p(i,e),r.isPlainObject(t)&&(n=t.options||{},t=t.name||""),r.isFunction(t)||(t=a[t]);if(!t||!r.isFunction(t))t=a["default"];e=t.call(this,e,this.realValue,n),this.set("data",e)},_keyupEvent:function(){if(this.get("disabled"))return;var e=this.get("trigger").val();this.oldInput=this.get("inputValue"),this.set("inputValue",e),e||(this.hide(),this.set("data",[]))},_keydownEvent:function(e){var t=this.get("selectedIndex");switch(e.which){case l.ESC:this.hide();break;case l.UP:e.preventDefault();if(!this.get("visible")&&this.get("data").length){this.show();return}if(!this.items)return;t>0?this.set("selectedIndex",t-1):this.set("selectedIndex",this.items.length-1);break;case l.DOWN:e.preventDefault();if(!this.get("visible")&&this.get("data").length){this.show();return}if(!this.items)return;t<this.items.length-1?this.set("selectedIndex",t+1):this.set("selectedIndex",0);break;case l.LEFT:case l.RIGHT:break;case l.ENTER:this.get("submitOnEnter")||e.preventDefault();if(!this.get("visible"))return;this.selectItem()}},_clear:function(e){this.$("[data-role=items]").empty(),delete this.items,delete this.lastIndex,delete this.currentItem,this.set("selectedIndex",-1)},_onRenderInputValue:function(e){e&&(this.realValue=this.get("inputFilter").call(this,e),this.dataSource.getData(this.realValue))},_onRenderData:function(e){if(!e.length){this._clear(),this.hide();return}var t=this.get("inputValue");if(t===this.oldInput){this._clear();return}this.items=null,this.set("selectedIndex",-1),this.model.items=e,this.renderPartial("[data-role=items]"),this.items=this.$("[data-role=items]").children(),this.currentItem=null,this.get("selectFirst")&&this.set("selectedIndex",0),this.show(),this.oldInput=t},_onRenderSelectedIndex:function(e){if(e===-1)return;var t=this.get("classPrefix")+"-item-hover";this.currentItem&&this.currentItem.removeClass(t),this.currentItem=this.items.eq(e).addClass(t),this.trigger("indexChange",e,this.lastIndex),this.lastIndex=e}});n.exports=c});