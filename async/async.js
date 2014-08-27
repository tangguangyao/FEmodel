/**
 * @file 异步函数控制
 */

var queue = function(funcs, scope) {
    (function next() {
        if(funcs.length > 0) {
            var f = funcs.shift();
            f.apply(
                scope,
                [next].concat(Array.prototype.slice.call(arguments, 0))
            );
        }
    })();
};

//我的简单理解为将要执行的函数放到funcs数组中，
//然后依次执行，执行完毕后执行回调函数开始执行下一个函数。
//所以每个加入funcs数组的函数都需要传入一个callback函数作为参数，
// 每个函数执行就会callback通知执行下一个