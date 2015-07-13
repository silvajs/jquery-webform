jquery-webform
==========

**最新一代的html5表单验证插件，跟随html5，兼容IE6+**

在提交表单时，利用html5的表单验证策略，如果浏览器支持html5则使用原生的表单验证，如果不支持，则模拟出一样的验证效果。

最简单的使用：

```
$('form').webform();
```

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
- [html5shiv](https://github.com/aFarkas/html5shiv) - *兼容IE8*

如果兼容IE8，同时使用了bootstrap，需要添加[Respond](https://github.com/scottjehl/Respond)。
列如：
```
<!--[if lt IE 9]>
    <script src="lib/html5shiv.min.js"></script>
    <script src="lib/respond.min.js"></script>
<![endif]-->
```


## Demo

请查看例子：[jquery-webform demo](http://htmlpreview.github.io/?https://github.com/silvajs/jquery-webform/blob/master/demo/index.html)


## 开发

开发的时候只需要编写`src`目录下的js文件，然后通过webpack来打包生成jquery-webform.js文件，具体步骤如下

- 安装[nodejs](https://nodejs.org/)
- 安装[webpack](http://webpack.github.io)，使用npm进行安装`npm install webpack -g`
- 进入项目根目录
    - `webpack --watch`：当src下的文件被改变的时候，自动重新生成jquery-webform.js
    - `webpack`：只执行一次动作，生成jquery-webform.js
- 可以打开/demo/webform.html页面，调试最新的代码


## i18n - 多语言支持

多语言支持的代码在`src/i18n`目录下，可以新增和自定义提示信息。那么如何使用多语言呢？

采用什么语言有以下优先级，从高到低：

- 如果在页面含有`<html lang="zh">`，则使用中文
- 如果在页面含有`<meta http-equiv="Content-Language" content="zh">`，则使用中文
- 以上都没有的时候，采用`src/config.js`里默认的语言，如`lang: 'zh'`


## API

具体的配置可以在`src/config.js`看到

```
var defaults = {
    forceSimulate: false,
    placeholder: true,
    autocomplete: 'off',
    lang: 'zh',
    messages: messages
};
```

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

#### lang
*string* - default: 'zh'

当表单验证不通过时给出提示信息，该提示性使用的语言。有哪些指可以查看`src/i18n/messages.js`

```
var messages = {
    'zh': require('./zh'),
    'en': require('./en')
};
```

#### messages
*object*

在表单验证不通过时，给出的提示信息，可支持多语言。同理与html5的提示信息，也会获取元素上的title值作为提示信息的部分内容

```
{
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
