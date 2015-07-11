var css = {
    '.webform-placeholderWraper': 'position:relative;line-height:normal;overflow:hidden;',
    '.webform-placeholderLabel': 'visibility:visible;cursor:text;position:absolute;left:0;top:0;color:#aa9f9f;display:block;line-height:16px;font-size:14px;white-space:nowrap;font-weight:normal;margin:0;',
    '.webform-alert': ' position:absolute;box-shadow:2px 2px 5px rgba(0,0,0,0.2),-2px 0 5px rgba(0,0,0,0.2);background:#fff',
    '.webform-alert-filter': 'background:#F0F0F0; position:absolute;top:0;left:0;bottom:0;right:0;background-repeat: repeat-x;',
    '.webform-alert-content': 'padding:12px 15px;border:1px solid #bab3b3;border-top-color:#c4bbbb; border-radius:3px;font-size:12px;font-family:"微软雅黑";zoom:1;position:relative;display:inline-block',
    '.webform-alert-icon': ' position:absolute;width:0;height:0;border:6px solid #c4bbbb;border-top-color:transparent;border-left-color:transparent;border-right-color:transparent;top:-12px;left:10px;z-index:2;_display:none',
    '.webform-alert-icon2': ' border-bottom-color:#fff;top:-11px;',
    '.webform-title': 'color:gray;margin-left:5px;font-style:normal'
};

var gradient = [
    'background-image: linear-gradient(top, #FFFFFF, #F0F0F0);background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#FFFFFF), to(#F0F0F0))',
    'background-image: -o-linear-gradient(top, #FFFFFF 0%, #F0F0F0 100%)',
    'background-image: linear-gradient(to bottom, #FFFFFF 0%, #F0F0F0 100%)',
    'filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#FFFFFF", endColorstr="#F0F0F0")'
];

css['.webform-alert-filter'] += gradient.join(';');

module.exports = css;