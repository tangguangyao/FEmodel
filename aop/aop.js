/**
 * @file aop 的方法（Aop又叫面向切面编程）
 */

var aop = {};

/**
 * aop-方法执行前拦截
 *
 * @param {Object} 方法所属的实例
 * @param {string} 方法名
 * @param {Function} 插入的方法
 */
aop.before = function(context, name, func) {
    var original = context[name];
    context[name] = function() {
        func.apply(this, arguments);
        return original.apply(this, arguments);
    };
};

/**
 * aop-方法执行后拦截
 *
 * @param {Object} 方法所属的实例
 * @param {string} 方法名
 * @param {Function} 插入的方法
 */
aop.after = function(context, name, func) {
    var original = context[name];
    context[name] = function() {
        var result = original.apply(this, arguments);
        func.apply(this, arguments);
        return result;
    };
};