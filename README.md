jquery-webform
==========

**最新一代的html5表单验证插件，跟随html5，兼容IE6+**

在提交表单时，利用html5的表单验证策略，如果浏览器支持html5则使用原生的表单验证，如果不支持，则模拟出一样的验证效果。

目前支持的input type：

- *email*
- *number*
- *url*

目前支持的html5属性有：

- *autofocus*
- *placeholder*
- *required*
- *pattern*
- *minlength*
- *maxlength*
- *min*
- *max*

## 依赖

- jquery
- [html5shiv](https://github.com/aFarkas/html5shiv)

如果兼容IE8，同时使用了bootstrap，需要添加[Respond](https://github.com/scottjehl/Respond)。
列如：
```
<!--[if lt IE 9]>
    <script src="lib/html5shiv.min.js"></script>
    <script src="lib/respond.min.js"></script>
<![endif]-->
```


## Demo

请查看例子：[jquery-webform demo](http://htmlpreview.github.io/?https://github.com/silvajs/jquery-webform/blob/master/demo.html)



## API

#### forceSimulate
*boolean* - default: `false`

强制使用模拟的验证策略，忽视html5的验证，哪怕浏览器支持html5，一般情况下不建议设置为`true`

#### placeholder
*boolean* - default: `true`

- `true`: 在不支持placeholder的浏览器，同样根据input元素上的placeholder模拟出同样的效果
- `false`: 不进行模拟动作

#### autocomplete
*string* - default: `off`

- `on`: 同input元素上的autocomplete属性
- `off`: 同input元素上的autocomplete属性

#### messages
*object*

在表单验证不通过时，给出的提示信息，可支持多语言。同理与html5的提示信息，也会获取元素上的title值作为提示信息的部分内容

```
$.fn.webform.messages = {
    required: '请填写此字段',
    pattern: '请匹配要求的格式',
    email: '请输入有效的邮箱地址',
    minlength: '请至少输入{0}个字符',
    maxlength: '最多输入{0}个字符',
    number: '请输入一个数字',
    min: '值必须大于或等于{0}',
    max: '值必须小于或等于{0}',
    url: '请输入正确的网址'
};
```
