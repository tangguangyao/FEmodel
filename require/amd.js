;(function(document) {
  
  function loadScript(url) {
    count++
    var script = document.createElement('script')
    //path = '' // future use
    script.async = true
    script.src = path + url + '.js'
    document.getElementsByTagName("head")[0].appendChild(script)
    script.onload = function(e) {
      currentPath = getPath(script.src)
      insertModule()
      count--
      if (count === 0){
        execFactory(app);
      }
      script.remove()
    }
  }

  function insertModule() {
    caches.forEach(function(module) {
      var deps = module[1]
      if (deps.length) {
        deps = deps.map(function(a) {
          return pathResolve(currentPath, a)
        })
        deps.forEach(function(a) {
          if (!modules[a]){
            loadScript(a);
          } 
        })
      }
      modules[currentPath] = {
        id: module[0],
        dependencies: deps,
        factory: module[2]
      }
    })
    caches = []
  }

  function execFactory(id) {
    var mod = modules[id]
    if ('value' in mod){
      return mod.value;
    } 
    var factory = mod.factory
    var deps = mod.dependencies
    if (deps.length) {
      var arr = deps.map(function(dep) {
        return execFactory(dep)
      })
      return modules[id].value = factory.apply(null, arr)
    }
    return modules[id].value = factory()
  }

  function getPath(href) {
    var a = document.createElement('a')
    a.href = href
    var p = a.pathname
    return p.substring(1, p.length - 3)
  }

  function getAttr(str) {
    return scriptEl.getAttribute('data-' + str) || ''
  }

  // resolve path
  // a/b/c ../d -> a/d
  // a/b/c ./e -> a/b/e 
  function pathResolve(path1, path2) {
    path1 = path1.split('/')
    path1.pop()
    var pathArr = path1.concat(path2.split('/'))
    var up = 0
    for (var i = pathArr.length - 1; i >= 0; i--) {
      var last = pathArr[i]
      if (last === '.') {
        pathArr.splice(i, 1)
      } else if (last === '..') {
        pathArr.splice(i, 1)
        up++
      } else if (up) {
        pathArr.splice(i, 1)
        up--
      }
    }
    return pathArr.join('/')
  }

  var scriptEl = document.getElementsByTagName('script')[0]
    , count = 0
    , caches = []
    , app
    , currentPath = ''
    , anony = 0
  define.modules = modules = {}

  function init() {
    app = getAttr('main')
    path = getAttr('path') + '/' // future use
    loadScript(app)
  }

  // sadly I find define is exec then onload is trigger..
  // we can save the define
  function define(id, dependencies, factory) {
    if (arguments.length === 2) {
      return define(anony++ + '', id, dependencies)
    } else if (arguments.length === 1) {
      if (typeof id === 'function') {
        return define(anony++ + '',[], id)
      } else if (Array.isArray(id)) {
        return define(anony++ + '', id, function() {})
      }
    }
    caches.push(arguments)
  }

  define.amd = {}
  window.define = define
  init()

})(document)