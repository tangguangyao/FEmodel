/**
 * @file 路由实现
 */

//一个储存我们路径的哈希表   
var routes = {};

/**
 * 路径注册函数
 * @param {string} path path是路径名
 * @param {string} templateId显示的模板
 * @param {Function} 执行的函数
 */
function route (path, templateId, controller){
    routes[path] = {
        templateId: templateId,
        controller: controller
    };
}

//运行路径
function routerRun() {
    //目前的路径url（在哈希中去除"#"）
    var url = location.hash.slice(1) || '/';
    //通过url获取路径   
    var route = routes[url];
    //我们同时拥有一个视图和路径吗？   
    if(route){
        for(var i in routes){
            if(i !== url){

                //隐藏不是对应路径的模板
                document.getElementById(routes[i].templateId)
                    .style.display="none";
            }else{

                //显示路径对应模板
                document.getElementById(routes[i].templateId)
                    .style.display="block";

                //运行对应路径的函数
                routes[i].controller();
            }
        }
    }else{
        
        //路径错误
        console.log("路径错误");
    }
}