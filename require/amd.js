;(function(document) {
    var scriptEl = document.getElementsByTagName('script')[0];

    // 引入模块的计数器
    var count = 0;

    // 保存外部引用define时传入的参数
    var caches = [];

    // 入口文件的path
    var appPath;

    // 相对的path
    var relativePath;

    // 生成内部使用的模块id
    var anony = 0;

    // 注册子模块
    var modules = {};

    define.modules = modules;
    define.amd = {};

    /**
     * 加载js
     * @private
     * @param {string} path
     */
    function loadScript(path) {
        count++;
        var script = document.createElement('script');
        script.async = true;
        script.src = relativePath + path + '.js';
        document.getElementsByTagName("head")[0].appendChild(script);

        // 完成添加，等待加载到页面并且执行
        script.onload = function() {
            var currentPath = getPath(script.src) || '';
            insertModule(currentPath);
            count--;

            // 当外部依赖执行完毕，运行入口模块
            if (count === 0){
                execFactory(appPath);
            }
            script.remove();
        };
    }

    /**
     * 获取当前的path地址
     * @private
     * @param {string} href
     * @return {string} path
     */
    function getPath(href) {
        var a = document.createElement('a');
        a.href = href;
        var p = a.pathname;
        return p.substring(1, p.length - 3);
    }

    /**
     * 获取当前的path地址
     * @global
     * @param {string=} id 给一个标志，这样别人通过id获取这个模块，而不是通过路径关系获取
     *                     大多数时候子模块都是不需要id的, 一般顶级模块才会用id
     * @param {Array.<string>=} dependencies 依赖，这是一个数组，包含自己需要的模块
     * @param {Function} factory 一个函数，这个函数的参数就是前面依赖的返回值
     */
    function define(id, dependencies, factory) {
        if (arguments.length === 2) {
            // 没有id时，分配一个id
            return define(anony++ + '', id, dependencies);
        } else if (arguments.length === 1) {
            if (typeof id === 'function') {
                // 如果传入的参数是一个函数，补齐
                return define(anony++ + '', [], id);
            } else if (Array.isArray(id)) {
                // 如果传入的参数是一个数组，表示传入的是依赖，补齐
                return define(anony++ + '', id, function() {});
            }
        }
        caches.push(arguments);
    }

    /**
     * 引入模块
     * @private
     * @param {string} currentPath 当前的path地址
     */
    function insertModule(currentPath) {
        caches.forEach(function(module) {
            var depsPath = module[1]; // module[1] 是模块的依赖
            if (depsPath.length) {
                depsPath = depsPath.map(function(path) {
                    return resolvePath(currentPath, path);
                });
                depsPath.forEach(function(path) {

                    // 如果依赖的模块没有引入，就引入
                    if (!modules[path]){

                        // 这里递归的引入所以的外部依赖
                        loadScript(path);
                    }
                });
            }

            // 注册，当前模块依赖的模块
            modules[currentPath] = {
                id: module[0],
                dependencies: depsPath,
                factory: module[2]
            };
        });
        caches = [];
    }

    /**
     * 解析path
     * @private
     * @param {string} currentPath 可参照的当前path地址
     * @param {string} path 需要解析的path地址
     * @return {string} newPath 返回path的可解析的地址
     */
    function resolvePath(currentPath, path) {
        currentPath = currentPath.split('/');
        currentPath.pop();
        var pathArr = currentPath.concat(path.split('/'));
        var up = 0;
        for (var i = pathArr.length - 1; i >= 0; i--) {
            var last = pathArr[i];
            if (last === '.') {
                pathArr.splice(i, 1);
            } else if (last === '..') {
                pathArr.splice(i, 1);
                up++;
            } else if (up) {
                pathArr.splice(i, 1);
                up--;
            }
        }
        return pathArr.join('/');
    }

    /**
     * 执行Factory
     * @private
     * @param {string} path 
     * @return
     */
    function execFactory(path) {
        var module = modules[path];
        if ('value' in module) {
            return module.value;
        }
        var factory = module.factory;
        var depsModulePath = module.dependencies;
        if (depsModulePath.length) {

            // 这里执行依赖函数，然后将依赖函数执行完毕的结果返回给一个参数数组
            var arr = depsModulePath.map(function(path) {
                return execFactory(path);
            });

            // 将依赖函数的执行结果作为参数传入factory执行
            modules[path].value = factory.apply(null, arr);
            return modules[path].value;
        }
        modules[path].value = factory();
        return modules[path].value;
    }

    /**
     * 获取自定义属性的值
     * @private
     * @param {string} name 
     * @return {string} 自定义属性的值
     */
    function getAttr(name) {
        return scriptEl.getAttribute('data-' + name) || '';
    }

    /**
    * 初始化
    * @private
    */
    function init() {
        appPath = getAttr('main');
        relativePath = getAttr('path') || '' + '/';

        // 加载入口模块
        loadScript(appPath);
    }

    // 全局define
    // AMD暴露在外的函数只有一个: define
    window.define = define;

    // 初始化
    init();
})(document);