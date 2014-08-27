/*
 * @file 订阅/发布
 * 这段代码来自《深入浅出nodejs》中讲述bigpipe模式的代码
 * 个人将发布订阅理解为，一个方法用于随时发布一个消息，另外一个订阅的方法接受这个随时发布的消息来执行
 */

/*
 * callbacks是一个对象集，所有订阅的消息名称都存入callbacks对象中
 */
var Bigpipe=function(){
    this.callbacks={};
};

/*
 * ready用于订阅消息
 * 首先判断订阅的这个消息是否在callbacks对象中，如果不在则在对象中新建一个
 * 然后把这个回调函数存入callbacks的key对象下
 * @param {string} 参数key是消息的名字
 * @param {Function} callback则是回调函数
 */
Bigpipe.prototype.ready = function (key, callback) {
    if (!this.callbacks[key]) {
        this.callbacks[key] = [];
    }
    this.callbacks[key].push(callback);
};

/*
 * set用于发出订阅消息
 * 首先确认发出的这个消息名称在callbacks对象中存在
 * 存在则一次执行这个key消息下的函数
 * @param {string} key是消息的名字
 * @param {Object} data是消息的数据
 */
Bigpipe.prototype.set = function(key, data){
    var callbacks = this.callbacks[key] || [];
    for (var i=0; i < callbacks.length; i++) {
        callbacks[i].call(this,data);
    }
};