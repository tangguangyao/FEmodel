/**
 * @file Promise简易实现
 * @see http://www.html-js.com/article/1850
 */


// 有死循环 ！！！

;(function() {

    /**
     * 构造函数
     * @constructor
     * @param {Function} resolver
     */
    function Promise(resolver) {

        // 保存链式调用的数组
        var queue = [];
        resolver(resolve, reject);

        /**
         * 流程控制函数，调用queue中下一个函数
         * @private
         * @param {number} 0-resolve 1-reject
         * @param {？} val 值
         */
        function next(i, val) {

            // 使用上不好，但是保证(resolve, reject)的出栈动作就肯定比进栈晚了
            setTimeout(function() {

                // 用while来用光全部的resolve
                while (queue.length) {

                    // 移出一个resolve和reject对, 也就是[resolve, reject]
                    var arr = queue.shift();
                    if (typeof arr[i] === 'function') {
                        try {
                            var chain = arr[i](val);
                        } catch (e) {
                            return reject(e);
                        }

                        // 一般来说链式的话resolve返回值为一个promise对象
                        // 所谓promise对象, 其实不过是 { then: function() {} }
                        // 也就是一个含有then函数的对象
                        if (chain && typeof chain.then === 'function') {
                            return chain.then(resolve, reject);
                        } else {
                            // 注意, 此处resolve中同样可以返回一个普通值
                            // 我们帮他包装成promise对象即可
                            return Promise.resolved(chain).then(resolve, reject);
                        }
                    }
                }
            });
        }

        /**
         * 正确时执行
         * @private
         * @param {？} x
         */
        function resolve(x) {
            next(0, x);
        }

        /**
         * 失败时执行
         * @private
         * @param {？} x
         */
        function reject(reason) {
            next(1, reason);
        }

        /**
         * 把then中的resolve和reject都存起来
         * @param {Function} resolve 成功
         * @param {Function} reject 失败
         */
        this.chain = this.then = function(resolve, reject) {
            queue.push([resolve, reject]);
            return this;
        };

        this.catch = function(reject) {
            return this.then(undefined, reject);
        };

    }

    /**
     * 成功执行
     * @param {Function} resolve 成功
     */
    Promise.resolved = Promise.cast = function(x) {
        return new Promise(function(resolve) {
            resolve(x);
        });
    };

    /**
     * 拒绝执行
     * @param {Function} reason 拒绝原因
     */
    Promise.rejected = function(reason) {
        return new Promise(function(resolve, reject) {
            reject(reason);
        });
    };

    /**
     * 所有情况
     * @param {Function} resolve 成功
     */
    Promise.all = function(values) {
        var defer = Promise.deferred();
        var len = values.length;
        var results = [];
        values.forEach(function(p, i) {
            p.then(function(x) {
                results[i] = x;
                len--;
                if (len === 0) {
                    defer.resolve(results);
                }
            }, function(r) {
                defer.reject(r);
            });
        });
        return defer.promise;
    };

    /**
     * 延迟执行
     */
    Promise.deferred = function() {
        var result = {};
        result.promise = new Promise(function(resolve, reject) {
            result.resolve = resolve;
            result.reject = reject;
        });
        return result;
    };

    window.Promise = Promise;
})();