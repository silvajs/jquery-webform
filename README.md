jquery-webform
==========

在提交表单时，利用html5的表单验证策略，如果浏览器支持html5则使用原生的表单验证，如果不支持，则模拟出一样的验证效果：

- *autofocus*
- *placeholder*
- *required*
- *pattern*
- *email*

**依赖**

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

