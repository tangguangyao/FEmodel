#了解一些前端框架很棒功能的一些思路

**双向数据绑定**
- 代码：DataBind
- 教程：[前端框架中的实用技术-双向数据绑定](http://hi.baidu.com/tang_guangyao/item/bb42dae08a12ce2e570f1d04)
- 查看效果：改变input中内容后，点击getInput能弹出改变的值；点击changeYao，Yao会改变


**调用异步函数**
- 代码：async
- 教程：[前端框架中的实用技术-调用异步函数](http://hi.baidu.com/tang_guangyao/item/d417f960e0d688346995e6c7)
- 查看效果：点击err，错误使用回调；点击callback实现普通回调；点击async使用框架
- *简单理解:*
- 1. 将要执行的函数放到funcs数组中，
- 2. 然后依次执行，执行完毕后执行回调函数开始执行下一个函数。
- 3. 所以每个加入funcs数组的函数都需要传入一个callback函数作为参数，每个函数执行就会callback通知执行下一个

**发布/订阅**
- 代码：message
- 教程：[前端框架中的实用技术-发布/订阅功能](http://hi.baidu.com/tang_guangyao/item/0edc4ed3e2e556d692a974d2)
- 查看效果：点击”发布消息通知执行“，订阅的函数会接收到消息并执行


**路由控制**
- 代码：message
- 教程：[前端框架中的实用技术-路由控制](http://hi.baidu.com/tang_guangyao/item/74e2ec041fbe28a13d42e23b)
- 查看效果：点击不同的链接，分别显示对应的模板

**模板引擎**
- 代码：Template
- 教程：[前端框架中的实用技术-模板引擎](http://hi.baidu.com/tang_guangyao/item/863e6a1e4b152bbe99ce3391)
- 查看效果：页面有一个简易模板，一个可执行js的模板

**模块开发**
- 代码：AMD
- 教程：
- 查看效果：不能直接点开html查看效果，需要在通过一个服务端打开,例如本地：http://localhost:8848/amd.html

**aop-面向切面编程**
- 代码：aop
- 教程：
- 查看效果：点击click,会有执行前和执行后的拦截