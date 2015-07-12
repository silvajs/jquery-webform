/*
 *   兼容所有的浏览器支持表单的html5属性，表现形式与谷歌和火狐一致，目前支持：
 *       autofocus、placeholder、required、pattern、email
 *   如果您对此进行了改进，请发一份到我的邮箱里，谢谢！
 *   @author Silva Zhou
 *   @email zhoulinspq2006@126.com
 *   @qq 294692513
 *   @site https://github.com/silvajs/jquery-webform
 */
;
(function($) {

    //class
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

    var inputElem = document.createElement('input');

    var html5Attrs = 'autocomplete autofocus list placeholder max min multiple pattern required step maxlength minlength'.split(' ');
    var methods = ['required', 'pattern', 'email', 'minlength', 'maxlength', 'number', 'min', 'max', 'url'];

    function getTitle(input) {
        var $el = $(input);
        return $el.attr('title') ? '：<i class="webform-title">' + $el.attr('title') + '</i>' : '';
    }

    function format(template) {
        var params = Array.prototype.slice.call(arguments, 1);
        $.each(params, function(i, n) {
            template = template.replace(new RegExp("\\{" + i + "\\}", "g"), function() {
                return n;
            });
        });
        return template;
    }

    function hasValue($el) {
        var elem = $el.get(0);
        if ($el.val().length > 0) {
            return true;
        }
        if (elem.validity && elem.validity.badInput) {
            return true;
        }
        return false;
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

    $.fn.textFocus = function(v) {
        var v = typeof v === 'undefined' ? 'all' : parseInt(v);
        this.each(function() {
            var range, len;
            try {
                if (this.createTextRange) {
                    range = this.createTextRange();
                    v === 'all' ? range.collapse(false) : range.move("character", v);
                    range.select();
                } else {
                    len = this.value.length;
                    v === 'all' ? this.setSelectionRange(len, len) : this.setSelectionRange(v, v);
                }
            } catch (e) {
                if (console && console.log) {
                    console.log(e.message);
                }
            }
            this.focus();
        });
        return this;
    };

    //弹出提示信息
    var Alert = function(text, $el) {
        this.$el = $el;
        this.init(text, $el);
    };

    Alert.prototype = {
        timeout: 5000,

        init: function(text, $el) {
            if (this.dialog) return;

            //显示提示信息
            var offset = this.$el.offset(),
                x = offset.left + 5,
                y = offset.top + this.$el.outerHeight() + 6;
            this.add(text, x, y);
            this.setTimer();
        },

        add: function(text, x, y) {
            var me = this;
            var html = ['<div class="webform-alert">',
                '<div class="webform-alert-icon"></div>',
                '<div class="webform-alert-icon webform-alert-icon2"></div>',
                '<div class="webform-alert-filter"></div>',
                '<span class="webform-alert-content">',
                text,
                '</span>',
                '</div>'
            ].join('');
            this.dialog = $(html);
            this.dialog.css({
                left: (x || 0) + 'px',
                top: (y || 0) + 'px'
            });
            $(document.body).append(this.dialog);
            this.registerEvents();
            return this;
        },

        remove: function() {
            this.dialog && this.dialog.remove();
            this.dialog = null;
            this.timer && clearTimeout(this.timer);
            this.off();
        },

        registerEvents: function() {
            var me = this;
            this.$el.on('keydown.webform', function() {
                var input = this;
                setTimeout(function() {
                    var webform = $(input.form).data('webform');
                    var pass = webform.runValidator($(input));
                    if (pass) {
                        me.remove();
                    }
                }, 0);
            });
            return this;
        },

        off: function() {
            this.$el.off('keydown.webform');
        },

        setTimer: function() {
            var me = this;
            this.timer = setTimeout(function() {
                me.remove();
                me.timer = null;
            }, this.timeout);
        },

        resetTimer: function() {
            this.timer && clearTimeout(this.timer);
            this.setTimer();
        },

        content: function(text) {
            if (!this.dialog) return;
            this.dialog.find('.webform-alert-content').html(text);
        }
    };

    var Webform = function(form, options) {
        var me = this;
        this.options = $.extend({}, defaults, options || {});
        this.init(form);
    };

    Webform.prototype.init = function(form) {
        this.$form = $(form);
        if (this.options.forceSimulate) {
            this.$form.attr('novalidate', 'novalidate');
        }
        this.setInput(html5Attrs);
        this.runMethods();
        this.registeEvents();
    };

    Webform.prototype.setInput = function(props) {
        this.input = {};
        for (var i = 0, len = props.length; i < len; i++) {
            this.input[props[i]] = !!(props[i] in inputElem);
        }
        if (this.input.list) {
            this.input.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
        }
    };

    Webform.prototype.runMethods = function() {
        this.placeholder();
        this.autofocus();
    };

    Webform.prototype.registeEvents = function() {
        var me = this;
        this.$form.on('submit', function(e) {
            e.preventDefault();
            return me.runValidators();
        });
        this.$form.on('click', '[type="submit"]', function(e) {
            e.stopPropagation();
        });
        $(document).click(function() {
            me.removeAlert();
        });
    };

    Webform.prototype.runValidators = function() {
        var form = this.$form.get(0);
        var inputs = $.grep(form.elements, function(elem, i) {
            return !$(elem).is(":disabled") && /^(?:input|textarea)/i.test(elem.nodeName);
        });
        for (var i = 0; i < inputs.length; i++) {
            var $el = $(inputs[i]);
            if (!this.runValidator($el)) {
                return false;
            }
        }
        return true;
    };

    Webform.prototype.runValidator = function($el) {
        for (var j = 0; j < methods.length; j++) {
            var method = methods[j];
            if (this[method] && !this[method]($el)) {
                return false;
            }
        }
        return true;
    };

    Webform.prototype.alert = function(text, input) {
        if (this.alertDialog) {
            this.alertDialog.remove();
        }
        $(input).attr('autocomplete', this.options.autocomplete);
        this.alertDialog = new Alert(text, input);
        input.focus();
    };

    Webform.prototype.removeAlert = function() {
        if (this.alertDialog) {
            this.alertDialog.remove();
            this.alertDialog = null;
        }
    };

    //模拟placeholder效果
    Webform.prototype.placeholder = function() {
        //支持placeholder，无需模拟
        if (this.input.placeholder || !this.options.placeholder) return;

        //给input增加模拟的html标签
        $('[placeholder]').each(function(i, dom) {
            var input = $(dom);
            var text = input.attr('placeholder');
            input.removeAttr('placeholder');
            var id = dom.id || Math.random(),
                paddingLeft = input.css('padding-left'),
                paddingTop = input.css('padding-top'),
                paddingBottom = input.css('padding-bottom'),
                height = input.css('height'),
                borderLeftWidth = input.css('border-left-width'),
                borderTopWidth = input.css('border-top-width'),
                borderBottomWidth = input.css('border-bottom-width'),
                boxSizing = input.css('box-sizing'),
                lineHeight = input.height() + 'px';
            var style = [
                'padding-left:' + paddingLeft,
                'padding-top:' + paddingTop,
                'padding-bottom:' + paddingBottom,
                'height:' + height,
                'line-height:' + lineHeight,
                'border-left-width:' + borderLeftWidth,
                'border-top-width:' + borderTopWidth,
                'border-bottom-width:' + borderBottomWidth,
                'border-style:solid',
                'border-color:transparent',
                '_border-color:#fff;_filter:chroma(color=#fff);_margin-left: 1px;_zoom:1;_border-right:none',
                'box-sizing:' + boxSizing
            ];
            if (input.val().length > 0) {
                style.push('visibility:hidden');
            }
            dom.id = id;
            input.wrap('<div class="webform-placeholderWraper"></div>').after('<label for="' + id + '" class="webform-placeholderLabel" style="' + style.join(';') + '">' + text + '</label>');

        }).on('keydown.placeholder', function() {
            var $el = $(this);
            var placeholderLabel = $(this).next('.webform-placeholderLabel');
            setTimeout(function() {
                if (hasValue($el)) {
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
            $('[autofocus]').last().textFocus();
        }, 0);
    };


    //文本框必须输入
    Webform.prototype.required = function($el) {
        if (!$el.attr('required')) {
            return true;
        }

        if (!hasValue($el)) {
            var text = this.options.messages.required + getTitle($el);
            this.alert(text, $el);
            return false;
        }
        return true;
    };

    //pattern验证输入
    Webform.prototype.pattern = function($el) {
        if (!$el.attr('pattern')) {
            return true;
        }

        var reg = new RegExp($el.attr('pattern'));
        if ($el.val().length > 0 && !reg.test($el.val())) {
            var text = this.options.messages.pattern + getTitle($el);
            this.alert(text, $el);
            return false;
        }
        return true;
    };

    Webform.prototype.email = function($el) {
        if ($el.attr('type') !== 'email') {
            return true;
        }
        var value = $el.val();
        if (!/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)) {
            var text = this.options.messages.email + getTitle($el);
            this.alert(text, $el);
            return false;
        }
        return true;
    };

    Webform.prototype.minlength = function($el) {
        if (!$el.attr('minlength')) {
            return true;
        }
        var minlength = parseInt($el.attr('minlength'));
        var value = $el.val();
        if (value.length < minlength) {
            var text = format(this.options.messages.minlength, minlength);
            this.alert(text, $el);
            return false;
        }
        return true;
    };

    Webform.prototype.maxlength = function($el) {
        if (!$el.attr('maxlength')) {
            return true;
        }
        var maxlength = parseInt($el.attr('maxlength'));
        var value = $el.val();
        if (value.length > maxlength) {
            var text = format(this.options.messages.maxlength, maxlength);
            this.alert(text, $el);
            return false;
        }
        return true;
    };

    Webform.prototype.number = function($el) {
        if ($el.attr('type') !== 'number') {
            return true;
        }
        var value = $el.val();
        if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) || (hasValue($el) && value.length === 0)) {
            var text = this.options.messages.number + getTitle($el);
            this.alert(text, $el);
            return false;
        }
        return true;
    };

    Webform.prototype.min = function($el) {
        if (!$el.attr('min')) {
            return true;
        }
        var value = parseFloat($el.val());
        var min = parseFloat($el.attr('min'));
        if (value < min) {
            var text = format(this.options.messages.min, min) + getTitle($el);
            this.alert(text, $el);
            return false;
        }
        return true;
    };

    Webform.prototype.max = function($el) {
        if (!$el.attr('max')) {
            return true;
        }
        var value = parseFloat($el.val());
        var max = parseFloat($el.attr('max'));
        if (value > max) {
            var text = format(this.options.messages.max, max) + getTitle($el);
            this.alert(text, $el);
            return false;
        }
        return true;
    };

    Webform.prototype.url = function($el) {
        if ($el.attr('type') !== 'url') {
            return true;
        }
        var value = $el.val();
        var reg = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        if (!reg.test(value)) {
            var text = this.options.messages.url + getTitle($el);
            this.alert(text, $el);
            return false;
        }
        return true;
    };

    $.fn.webform = function(options) {
        this.each(function() {
            var data = $(this).data('webform');
            if (!data) {
                options = options || {};
                var messages = $.extend({}, $.fn.webform.messages, options.messages || {});
                options.messages = messages;
                $(this).data('webform', new Webform(this, options));
            }
        });
    };

    var defaults = {
        forceSimulate: false,
        placeholder: true,
        autocomplete: 'off',
        messages: null
    };

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

    $.fn.webform.addMethod = function(method, fn) {
        if (Webform.prototype[method]) {
            if (console && console.log) {
                console.log('The method "' + method + '" has been existed, and you will rewrite this method');
            }
        }
        methods.push(method);
        Webform.prototype[method] = fn;
    };


})(jQuery);