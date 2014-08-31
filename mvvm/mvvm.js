/**
 * @file MVVM框架
 * @see http://www.html-js.com/article/1851
 */

;(function() {

    "use strict";
    var start = '{{';
    var end = '}}';

    /**
     * mvvm实例
     * @param {string} sel dom选择器
     * @param {Object} opt data对象
     */
    function mvvm(sel, opt) {
        return new MVVM(sel, opt);
    }

    /**
     * MVVM
     * @constructor
     * @param {string} sel dom选择器
     * @param {Object} data model对象
     */
    function MVVM(sel, opt) {
        
        this.sel = sel;
        this.opt = opt;
        this.init();
    }

    MVVM.prototype = {

        /**
         * 初始化
         */
        init: function () {
            var opt = this.opt;
            this.root = document.querySelector(this.sel);
            this.pureModel = opt.model || {};
            this.model2sync = {};
            this.model = this.getProxyModel();

            for (var k in this.pureModel) {
                this.model2sync[k] = [];
            }
            this.renderDOM(this.root);
            this.listenView();
        },

        /**
         * 监听view的改变，同时修改model中的数据
         */
        listenView: function () {
            var me = this;
            if (me.opt.type === 'form') {
                bindEvent(me.root, ['keyup', 'click'], function(e) {
                    var name = e.target.name;
                    var value = e.target.value;
                    if (name) {
                        if (value != me.pureModel[name]) {
                            me.model[name] = value;
                        }
                    }
                });
            }
        },

        /**
         * 代理的model, 他的key和model一模一样
         */
        getProxyModel: function () {
            var obj = {};
            var me = this;
            each(Object.keys(me.pureModel), function(i, k) {

                // Object.defineProperty() 方法直接在一个对象上定义一个新属性，
                // 或者修改一个已经存在的属性， 并返回这个对象。
                // @see https://developer.mozilla.org/zh-CN/docs/Web/
                // JavaScript/Reference/Global_Objects/Object/defineProperty
                Object.defineProperty(obj, k, {
                    set: function(v) {
                        me.pureModel[k] = v;
                        var arr = me.model2sync[k];
                        each(arr, function() {
                            this.node.textContent = me.renderStr(this.raw);
                        });
                    },
                    get: function() {
                        return me.model[k];
                    }
                });
            });
            return obj;
        },

        /*
         * 先render属性节点, 再render子节点, 如果子节点有dom节点, 则递归执行
         * @param {string} dom 节点
         */
        renderDOM: function (dom) {
            var me = this;
            each(dom.attributes, function() {
                me.render(this);
            });
            each(dom.childNodes, function() {
                if (this.nodeType === 1) {
                    return me.renderDOM(this);
                }
                me.render(this);
            });
        },

        /**
         * 找到最小节点的textContent中含有{{key}}这样的变量, 并替换它
         * @param {string} node 节点
         */
        render: function (node) {
            // textContent 属性设置或返回指定节点的文本内容，以及它的所有后代。
            // Internet Explorer 8 以及更早的版本不支持此属性
            var arr = node.textContent.split(start);
            if (!arr.length) {
                return;
            }
            var ret = '';
            for (var i = 0, item; item = arr[i++];) {
                var two = item.split(end);
                if (two.length === 1) {
                    ret += item;
                } else {
                    ret += this.pureModel[two[0]] + two[1];
                    this.model2sync[two[0]].push({
                        node: node,
                        raw: node.textContent
                    });
                }
            }
            node.textContent = ret;
        },

        /**
         * 找到含有{{key}}这样的变量, 并替换它
         * @param {string} node 节点
         */
        renderStr: function (str) {
            var ret = '';
            var arr = str.split(start); // sure have length
            for (var i = 0, item; item = arr[i++];) {
                var two = item.split(end);
                if (two.length === 1){
                    ret += item;
                } else {
                    ret += this.pureModel[two[0]] + two[1];
                }
            }
            return ret;
        }

    };

    /**
     * 监听view的改变
     * @param {Object} dom dom元素
     * @param {Array.<string>?string} events 监听的事件
     * @param {Function} handler 触发事件
     */
    function bindEvent(dom, events, handler) {
        if (Array.isArray(events)) {
            each(events, function() {
                bindEvent(dom, this, handler);
            });
        } else {
            dom.addEventListener(events, handler, true);
        }
    }

    /**
     * 遍历函数
     * @private
     * @param {Array} arr 数组
     * @param {Function} fn 执行的函数
     */
    function each(arr, fn) {
        for (var i = 0, item; item = arr[i++];) {
            fn.call(item, i, item);
        }
    }

    window.mvvm = mvvm;

})();
