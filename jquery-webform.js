/*
 *   兼容所有的浏览器支持表单的html5属性，表现形式与谷歌和火狐一致，目前支持：
 *       autofocus、placeholder、required、pattern
 *   共享此文件的目的是希望有人能帮忙完善，减少在表单处理方面的工作量，并能不吝啬的共享出来。
 *   如果您对此进行了改进，请发一份到我的邮箱里，谢谢！
 *   @author Silva Zhou
 *   @email zhoulinspq2006@126.com
 *   @qq 294692513
 */
;
(function($) {

    //class
    var css = {
        '.webform-placeholderWraper': 'position:relative;line-height:normal;overflow:hidden;display:inline-block;',
        '.webform-placeholderLabel': 'visibility:visible;cursor:text;position:absolute;left:0;top:0;color:#aa9f9f;display:block;line-height:16px;font-size:14px;white-space:nowrap;font-weight:normal;margin:0;',
        '.webform-alert': ' position:absolute;box-shadow:2px 2px 5px rgba(0,0,0,0.2),-2px 0 5px rgba(0,0,0,0.2)',
        '.webform-alert-filter': 'background:#F0F0F0; filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#FFFFFF", endColorstr="#F0F0F0");background: linear-gradient(top, #FFFFFF, #F0F0F0);background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#FFFFFF), to(#F0F0F0));position:absolute;top:0;left:0;bottom:0;right:0;',
        '.webform-alert-content': ' padding:12px 15px;border:1px solid #bab3b3;border-top-color:#c4bbbb; border-radius:3px;font-size:12px;font-family:"微软雅黑";zoom:1;position:relative;',
        '.webform-alert-icon': ' position:absolute;width:0;height:0;border:6px solid #c4bbbb;border-top-color:transparent;border-left-color:transparent;border-right-color:transparent;top:-12px;left:10px;z-index:2;',
        '.webform-alert-icon2': ' border-bottom-color:#fff;top:-11px;'
    };

    var Webform = function() {
        this.config = {
            placeholder: true, //设为false取消模拟
            autofocus: true,
            required: true,
            pattern: true
        }
        this.init();
    };

    var attrs = {};

    var inputElem = document.createElement('input');

    var html5Attrs = 'autocomplete autofocus list placeholder max min multiple pattern required step'.split(' ');

    function getTitle(input) {
        return (input.attr('title') ? '：' + input.attr('title') : '') + '。';
    }


    //添加样式
    ;
    (function(styles) {
        var styleSheet,
            i = 0;
        if (document.createStyleSheet) {
            styleSheet = document.createStyleSheet();
        } else {
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(document.createElement('style'));
            styleSheet = document.styleSheets[document.styleSheets.length - 1];
        }
        //传入的是css对象
        for (var selector in styles) {
            if (styleSheet.insertRule) {
                styleSheet.insertRule(selector + '{' + styles[selector] + '}', i++);
            } else {
                styleSheet.addRule(selector, styles[selector], i++);
            }
        }
    })(css);

    //文本框光标聚焦
    $.fn.textFocus = function(v) {
        var v = typeof v === 'undefined' ? 'all' : parseInt(v);
        this.each(function() {
            var range, len;
            if (this.createTextRange) {
                range = this.createTextRange(); //文本框创建范围
                v === 'all' ? range.collapse(false) : range.move("character", v); //范围折叠
                range.select();
            } else {
                len = this.value.length;
                v === 'all' ? this.setSelectionRange(len, len) : this.setSelectionRange(v, v); //dom直接设置选区，然后focus
            }
            this.focus();
        });
        return this;
    }



    //返回是否支持以下html5属性
    Webform.prototype.input = (function(props) {
        for (var i = 0, len = props.length; i < len; i++) {
            attrs[props[i]] = !!(props[i] in inputElem);
        }
        if (attrs.list) {
            attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
        }
        return attrs;
    })(html5Attrs);

    Webform.prototype.init = function() {
        var me = this;
        this.config.placeholder && this.placeholder();
        this.config.autofocus && this.autofocus();
        $('form').submit(function(e) {
            return me.submit(this);
        });
        $(document).click(function(e) {
            me.alertDialog && me.alertDialog.remove();
        });
    }

    //表单提交时的验证
    Webform.prototype.submit = function(form) {
        var inputsArr = $.grep(form.elements, function(elem, i) {
            return !$(elem).is(":disabled") && /^(?:input|textarea)/i.test(elem.nodeName);
        });
        for (var i = 0; i < inputsArr.length; i++) {
            if ((this.config.required && !this.required(inputsArr[i])) || (this.config.pattern && !this.pattern(inputsArr[i]))) {
                return false;
            }
        }
        return true;
    }


    //模拟placeholder效果
    Webform.prototype.placeholder = function() {
        //支持placeholder，无需模拟
        if (this.input.placeholder) return;

        //给input增加模拟的html标签
        $('[placeholder]').each(function(i, dom) {
            var input = $(dom);
            var text = input.attr('placeholder');
            var id = dom.id || Math.random(),
                width = input.css('width'),
                padding = input.css('padding'),
                height = input.css('height'),
                border = input.css('border'),
                boxSizing = input.css('box-sizing'),
                lineHeight = input.height() + 'px';
            var style = ['padding:', padding, ';height:', height, ';line-height:', lineHeight, ';border:', border, ';border-color:transparent;box-sizing:', boxSizing].join('');
            dom.id = id;
            debugger
            input.wrap('<div class="webform-placeholderWraper" style="width:' + width + '"></div>').
            after('<label for="' + id + '" class="webform-placeholderLabel" style="' + style + '">' + text + '</label>');

        }).on('keydown.placeholder', function() {
            var me = this;
            var placeholderLabel = $(this).next();
            setTimeout(function() {
                if (me.value !== '') {
                    placeholderLabel.css('visibility', 'hidden');
                } else {
                    placeholderLabel.css('visibility', 'visible');
                }
            }, 0);

        });

    };

    //模拟自动聚焦
    Webform.prototype.autofocus = function() {
        if (this.input.autofocus) return;

        setTimeout(function() {
            $('[autofocus]').last().focus();
        }, 0);
    };


    //文本框必须输入
    Webform.prototype.required = function(elem) {
        if (this.input.required) return true;

        var input = $(elem);
        if (input.attr('required') && input.val().length === 0) {
            var text = '请填写此字段' + getTitle(input);
            this.alertDialog = this.alert(text, input);
            input.textFocus();
            return false;
        }
        return true;
    }

    //pattern验证输入
    Webform.prototype.pattern = function(elem) {
        if (this.input.pattern) return true;

        var input = $(elem);
        if (input.attr('pattern')) {
            var reg = new RegExp(input.attr('pattern'));
            if (input.val().length > 0 && !reg.test(input.val())) {
                var text = '请匹配要求的格式' + getTitle(input);
                this.alertDialog = this.alert(text, input);
                input.textFocus();
                return false;
            }
        }
        return true;
    }



    //弹出提示信息
    var Alert = function(text, input) {
        return new Alert.prototype.init(text, input);
    }

    Alert.prototype = {
        timeout: 5000,
        init: function(text, input) {
            if (this.dialog) return;

            //显示提示信息
            var offset = input.offset(),
                x = offset.left + 5,
                y = offset.top + input.outerHeight() + 6;
            this.input = input;
            this.add(text, x, y).on(); //给输入框绑定keydown事件
            //设置提示信息几秒后消失
            this.setTime();
        },
        add: function(text, x, y) {
            var me = this;
            var html = ['<div class="webform-alert">',
                '<div class="webform-alert-icon"></div>',
                '<div class="webform-alert-icon webform-alert-icon2"></div>',
                '<div class="webform-alert-filter"></div>',
                '<div class="webform-alert-content">',
                text,
                '</div>',
                '</div>'
            ].join('');
            this.dialog = $(html);
            this.dialog.css({
                left: (x || 0) + 'px',
                top: (y || 0) + 'px'
            });
            $(document.body).append(this.dialog);
            return this;
        },
        remove: function() {
            this.dialog && this.dialog.remove();
            this.dialog = null;
            this.time && clearTimeout(this.time);
            this.off();
        },
        on: function() {
            var me = this;
            this.input.on('keydown.webform', function() {
                var input = $(this);
                setTimeout(function() {
                    var value = input.val();
                    var title = getTitle(input);
                    me.resetTime();
                    if (input.attr('required') && value.length === 0) {
                        var text = '请填写此字段' + title;
                        me.content(text);
                    } else if (input.attr('pattern') && value.length > 0 && !(new RegExp(input.attr('pattern'))).test(value)) {
                        var text = '请匹配要求的格式' + title;
                        me.content(text);
                    } else {
                        me.remove();
                    }

                }, 0);
            });
            return this;
        },
        off: function() {
            //删除相应的keydown事件
            this.input.off('keydown.webform');
        },
        setTime: function() {
            var me = this;
            this.time = setTimeout(function() {
                me.remove();
                clearTimeout(me.time);
            }, this.timeout);
        },
        resetTime: function() {
            this.time && clearTimeout(this.time);
            this.setTime();
        },
        content: function(text) {
            if (!this.dialog) return;
            this.dialog.find('.webform-alert-content').html(text);
        }
    };

    Alert.prototype.init.prototype = Alert.prototype;
    Webform.prototype.alert = Alert;


    $(function() {
        new Webform();
    });

})(jQuery);