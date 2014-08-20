jquery-webform
==========

兼容所有的浏览器支持表单的html5属性，表现形式与谷歌和火狐一致，目前支持：

- *autofocus*
- *placeholder*
- *required*
- *pattern*

**依赖于jQuery**

在页面中就像写html5一样，只需要额外加载`webform.js`即可。  

```
<form>
    <input type="text" placeholder="用户/电话/邮箱用户/电话/邮箱用户/电话/邮箱" required autofocus title="请输入3个字母" pattern="^[a-zA-Z]{3}$" style="height: 40px; width: 200px" />
    <hr />
    <input type="text" placeholder="电子邮箱" required="required" title="输入您的邮箱" />
    <hr>
    <input type="number" max="10" required="required">
    <input type="range" />
    <textarea required="required" placeholder="邮箱" style="height: 60px;"></textarea>
    <hr>
    <button type="submit">提交</button>
</form>
```
