/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	var Webform = __webpack_require__(3);
	var methods = __webpack_require__(10);
	var validators = __webpack_require__(16);

	Webform.addMethods.apply(null, methods);
	Webform.addValidators.apply(null, validators);

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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var css = __webpack_require__(2);

	var loadCss = function(styles) {
	    var styleSheet,
	        i = 0;
	    if (document.createStyleSheet) {
	        styleSheet = document.createStyleSheet();
	    } else {
	        var head = document.getElementsByTagName('head')[0];
	        head.appendChild(document.createElement('style'));
	        styleSheet = document.styleSheets[document.styleSheets.length - 1];
	    }
	    
	    for (var selector in styles) {
	        if (styleSheet.insertRule) {
	            styleSheet.insertRule(selector + '{' + styles[selector] + '}', i++);
	        } else {
	            styleSheet.addRule(selector, styles[selector], i++);
	        }
	    }
	};

	loadCss(css);

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Alert = __webpack_require__(4);
	var config = __webpack_require__(5);
	var getTitle = __webpack_require__(9).getTitle;
	var format = __webpack_require__(9).format;

	var methods = [];
	var validators = [];

	var Webform = function(form, options) {
		this.$form = $(form);
		this.options = $.extend(true, {}, config, options || {});
		this.init(form);
	};

	Webform.prototype.init = function(form) {
		if (this.options.forceSimulate) {
			this.$form.attr('novalidate', 'novalidate');
		}
		this.runMethods();
		this.registeEvents();
	};

	Webform.prototype.runMethods = function() {
		for (var i = 0; i < methods.length; i++) {
			var method = methods[i];
			if ($.isFunction(method)) {
				method.call(this);
			}
		}
	};

	Webform.prototype.registeEvents = function() {
		var me = this;
		this.$form.on('submit', function(e) {
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
		for (var j = 0; j < validators.length; j++) {
			var validator = validators[j];
			if ($.isFunction(validator) && !validator.call(this, $el)) {
				return false;
			}
		}
		return true;
	};

	Webform.prototype.alert = function(text, $el) {
		text += getTitle($el);
		this.removeAlert();
		this.alertDialog = new Alert(text, $el);
		$el.focus();
	};

	Webform.prototype.removeAlert = function() {
		if (this.alertDialog) {
			this.alertDialog.remove();
			this.alertDialog = null;
		}
	};

	Webform.prototype.getMessage = function(name) {
		var lang = this.options.lang;
		var template = this.options.messages[lang][name];
		var params = Array.prototype.slice.call(arguments, 1);
		var msg = format.apply(null, [template].concat(params));
		return msg;
	};

	Webform.addMethods = function() {
		var fns = $.makeArray(arguments);
		methods = methods.concat(fns);
	};

	Webform.addValidators = function() {
		var fns = $.makeArray(arguments);
		validators = validators.concat(fns);
	};

	module.exports = Webform;

/***/ },
/* 4 */
/***/ function(module, exports) {

	var Alert = function(text, $el) {
	    this.$el = $el;
	    this.init(text, $el);
	};

	Alert.prototype = {
	    timeout: 5000,

	    init: function(text, $el) {
	        this.remove();

	        var offset = this.$el.offset(),
	            x = offset.left + 5,
	            y = offset.top + this.$el.outerHeight() + 6;
	        this.add(text, x, y);
	        this.setTimer();
	    },

	    add: function(text, x, y) {
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
	        if (this.dialog) {
	            this.dialog.remove();
	            this.dialog = null;
	        }
	        if (this.timer) {
	            clearTimeout(this.timer);
	            this.timer = null;
	        }
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
	    }
	};

	module.exports = Alert;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var messages = __webpack_require__(6);

	var defaults = {
		forceSimulate: false,
		placeholder: true,
		autocomplete: 'off',
		lang: 'zh',
		messages: messages
	};

	module.exports = defaults;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var messages = {
		'zh': __webpack_require__(7),
		'en': __webpack_require__(8)
	};

	module.exports = messages;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {
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

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = {
		required: 'This field is required',
		pattern: 'Invalid forma',
		email: 'Please enter a valid email address',
		url: 'Please enter a valid URL',
		number: 'Please enter a valid number',
		equalTo: 'Please enter the same value again',
		maxlength: 'Please enter no more than {0} characters',
		minlength: 'Please enter at least {0} characters',
		max: 'Please enter a value less than or equal to {0}',
		min: 'Please enter a value greater than or equal to {0}'
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	exports.getTitle = function(input) {
	    var $el = $(input);
	    return $el.attr('title') ? '：<i class="webform-title">' + $el.attr('title') + '</i>' : '';
	}

	exports.format = function(template) {
	    var params = Array.prototype.slice.call(arguments, 1);
	    $.each(params, function(i, n) {
	        template = template.replace(new RegExp("\\{" + i + "\\}", "g"), function() {
	            return n;
	        });
	    });
	    return template;
	}

	exports.hasValue = function($el) {
	    var elem = $el.get(0);
	    if ($el.val().length > 0) {
	        return true;
	    }
	    if (elem.validity && elem.validity.badInput) {
	        return true;
	    }
	    return false;
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var methods = [
		__webpack_require__(11),
		__webpack_require__(12),
		__webpack_require__(13),
		__webpack_require__(14),
		__webpack_require__(15)
	];

	module.exports = methods;

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = function() {
		var lang = $('html').attr('lang');
		if (!lang) {
			lang = $('meta[http-equiv="Content-Language"]').attr('content');
		}
		if (lang) {
			this.options.lang = lang;	
		}
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	var inputElem = document.createElement('input');
	var html5Attrs = 'autocomplete autofocus list placeholder max min multiple pattern required step maxlength minlength'.split(' ');

	module.exports = function() {
		this.input = {};
		for (var i = 0, len = html5Attrs.length; i < len; i++) {
			this.input[html5Attrs[i]] = !!(html5Attrs[i] in inputElem);
		}
		if (this.input.list) {
			this.input.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
		}
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function() {
		if (this.input.autofocus) return;

		setTimeout(function() {
			$('[autofocus]').last().textFocus();
		}, 0);
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var hasValue = __webpack_require__(9).hasValue;

	module.exports = function() {
	    if (this.input.placeholder || !this.options.placeholder) return;

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

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = function() {
		var form = this.$form.get(0);
		var autocomplete = this.options.autocomplete;
		$.each(form.elements, function(i, elem) {
			$(elem).attr('autocomplete', autocomplete);
		});
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var validators = [
		__webpack_require__(17),
		__webpack_require__(18),
		__webpack_require__(19),
		__webpack_require__(20),
		__webpack_require__(21),
		__webpack_require__(22),
		__webpack_require__(23),
		__webpack_require__(24),
		__webpack_require__(25)
	];

	module.exports = validators;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var hasValue = __webpack_require__(9).hasValue;

	module.exports = function($el) {
	    if (!$el.attr('required')) {
	        return true;
	    }
	    if (!hasValue($el)) {
	        var text = this.getMessage('required');
	        this.alert(text, $el);
	        return false;
	    }
	    return true;
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function($el) {
	    if ($el.attr('type') !== 'email') {
	        return true;
	    }
	    var value = $el.val();
	    if (!/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)) {
	        var text = this.getMessage('email');
	        this.alert(text, $el);
	        return false;
	    }
	    return true;
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var hasValue = __webpack_require__(9).hasValue;

	module.exports = function($el) {
	    if ($el.attr('type') !== 'number') {
	        return true;
	    }
	    var value = $el.val();
	    if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) || (hasValue($el) && value.length === 0)) {
	        var text = this.getMessage('number');
	        this.alert(text, $el);
	        return false;
	    }
	    return true;
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function($el) {
	    if (!$el.attr('min')) {
	        return true;
	    }
	    var value = parseFloat($el.val());
	    var min = parseFloat($el.attr('min'));
	    if (value < min) {
	        var text = this.getMessage('min', min);
	        this.alert(text, $el);
	        return false;
	    }
	    return true;
	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = function($el) {
	    if (!$el.attr('max')) {
	        return true;
	    }
	    var value = parseFloat($el.val());
	    var max = parseFloat($el.attr('max'));
	    if (value > max) {
	        var text = this.getMessage('max', max);
	        this.alert(text, $el);
	        return false;
	    }
	    return true;
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function($el) {
	    if (!$el.attr('minlength')) {
	        return true;
	    }
	    var minlength = parseInt($el.attr('minlength'));
	    var value = $el.val();
	    if (value.length < minlength) {
	        var text = this.getMessage('minlength', minlength);
	        this.alert(text, $el);
	        return false;
	    }
	    return true;
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function($el) {
	    if (!$el.attr('maxlength')) {
	        return true;
	    }
	    var maxlength = parseInt($el.attr('maxlength'));
	    var value = $el.val();
	    if (value.length > maxlength) {
	        var text = this.getMessage('maxlength', maxlength);
	        this.alert(text, $el);
	        return false;
	    }
	    return true;
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = function($el) {
	    if ($el.attr('type') !== 'url') {
	        return true;
	    }
	    var value = $el.val();
	    var reg = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
	    if (!reg.test(value)) {
	        var text = this.getMessage('url');
	        this.alert(text, $el);
	        return false;
	    }
	    return true;
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = function($el) {
	    if (!$el.attr('pattern')) {
	        return true;
	    }

	    var reg = new RegExp($el.attr('pattern'));
	    if ($el.val().length > 0 && !reg.test($el.val())) {
	        var text = this.getMessage('pattern');
	        this.alert(text, $el);
	        return false;
	    }
	    return true;
	};

/***/ }
/******/ ]);