/**
 * @file Promise简易实现
 * @see http://www.html-js.com/article/Promise-translation-JavaScript-Promise-devil-details
 */

function Promise(fn) {
    var state = 'pending';
    var value;
    var deferred = null;

    function resolve(newValue) {
        try {
            if(newValue && typeof newValue.then === 'function') {
                newValue.then(resolve, reject);
                return;
            }
            state = 'resolved';
            value = newValue;

            if(deferred) {
                handle(deferred);
            }
        } catch (e) {
            reject(e);
        }
    }

    function reject(reason) {
        state = 'rejected';
        value = reason;

        if(deferred) {
            handle(deferred);
        }
    }

    function handle(handler) {
        if(state === 'pending') {
            deferred = handler;
            return;
        }

        setTimeout(function () {
            var handlerCallback;

            if(state === 'resolved') {
                handlerCallback = handler.onResolved;
            } else {
                handlerCallback = handler.onRejected;
            }

            if(!handlerCallback) {
                if(state === 'resolved') {
                    handler.resolve(value);
                } else {
                    handler.reject(value);
                }

                return;
            }

            try {
                ret = handlerCallback(value);
            } catch(e) {
                handler.reject(e);
                return;
            }

            handler.resolve(ret);
        }, 1);
        
    }

    this.then = function(onResolved, onRejected) {
        return new Promise(function(resolve, reject) {
            handle({
                onResolved: onResolved,
                onRejected: onRejected,
                resolve: resolve,
                reject: reject
            });
        });
    };

    fn(resolve, reject);
}