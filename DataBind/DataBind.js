/**
 * @file 双向数据绑定
 */

function DataBinder(object_id) {
    // Use a jQuery object as simple PubSub
    var pubSub = jQuery({});

    // We expect a `data` element specifying the binding
    // in the form: data-bind-<object_id>="<property_name>"
    //我们希望一个data元素可以在表单中指明绑定：data-bind-<object_id>="<property_name>"
    var data_attr = "bind-" + object_id,
        message = object_id + ":change";

    // Listen to change events on elements with the data-binding attribute and proxy
    // them to the PubSub, so that the change is "broadcasted" to all connected objects
    //使用data-binding属性和代理来监听那个元素上的变化事件
    // 以便变化能够“广播”到所有的关联对象
    $(document).on("change", "[data-" + data_attr + "]",
        function(evt) {
            var $input = $(this);

            pubSub.trigger(message, [$input.data( data_attr ), $input.val()]);
        });

    // PubSub propagates changes to all bound elements, setting value of
    // input tags or HTML content of other tags
    //PubSub将变化传播到所有的绑定元素，设置input标签的值或者其他标签的HTML内容
    pubSub.on(message, function(evt, prop_name, new_val , initiator) {
        if(initiator){
            $("[data-" + data_attr + "=" + prop_name + "]").each( function() {
                var $bound = $(this);

                if ($bound.is("input, textarea, select")) {
                    $bound.val(new_val);
                } else {
                    $bound.html(new_val);
                }
            });
        }
    });

    return pubSub;
}


function Bind(uid) {
    var binder = new DataBinder( uid ),
        user = {
            attributes: {},
            // The attribute setter publish changes using the DataBinder PubSub
            set: function(attr_name, val ,fromHtml) {
                this.attributes[ attr_name ] = val;
                if(!fromHtml){
                    //这里加一个判断，如果set设置消息是来自html的，就不用执行下面发布消息
                    binder.trigger(uid + ":change", [attr_name, val, this]);
                }
            },

            get: function(attr_name) {
                return this.attributes[ attr_name ];
            },

            _binder: binder
        };

        // Subscribe to the PubSub
        binder.on(uid + ":change",
            function(evt, attr_name, new_val, initiator) {
                //如果是通过user设置的对象，就不需要执行这个消息
                if ( initiator !== user ) {
                //如果initiator为underfind，则是html中改变发出的消息
                user.set( attr_name, new_val ,true);//这里增加一个参数，表示这个set是来自html而设置的
                }
            });

    return user;
}