(function() {

    var registry = {
        listeners: { },
        resolves: { }
    };

    function addLoadListener(name, listener) {
        if (name in registry.resolves) {
            // value is already loaded, call listener immediately
            listener(name, registry.resolves[name]);
        } else if (registry.listeners[name]) {
            registry.listeners[name].push(listener);
        } else {
            registry.listeners[name] = [ listener ];
        }
    }

    function resolve(name, value) {
        registry.resolves[name] = value;
        var libListeners = registry.listeners[name];
        if (libListeners) {
            libListeners.forEach(function(listener) {
                listener(name, value);
            });
            delete registry.listeners[name];
        }
    }

    window.require = function(deps, definition) {
        if (deps.length === 0) {
            // no dependencies, run definition now
            definition();
        } else {
            // we need to wait for all dependencies to load
            var values = [], loaded = 0;
            function dependencyLoaded(name, value) {
                values[deps.indexOf(name)] = value;
                if (++loaded >= deps.length) {
                    definition.apply(null, values);
                }
            }
            deps.forEach(function(dep) {
                addLoadListener(dep, dependencyLoaded);
            });
        }
    }

    window.define = function(name, deps, definition) {
        if (!definition) {
            // just two arguments - bind name to value (deps) now
            resolve(name, deps);
        } else {
            // asynchronous define with dependencies
            require(deps, function() {
                resolve(name, definition.apply(null, arguments));
            });
        }
    }

}());