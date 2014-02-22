#了解一些前端框架很棒功能的一些思路

**双向数据绑定**
- 代码：DataBind
- 教程：[前端框架中的实用技术-双向数据绑定](http://hi.baidu.com/tang_guangyao/item/bb42dae08a12ce2e570f1d04)
- 查看效果：改变input中内容后，点击getInput能弹出改变的值；点击changeYao，Yao会改变


**调用异步函数**
- 代码：async
- 教程：[前端框架中的实用技术-调用异步函数](http://hi.baidu.com/tang_guangyao/item/d417f960e0d688346995e6c7)
- 查看效果：点击err，错误使用回调；点击callback实现普通回调；点击async使用框架
*简单理解:*
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