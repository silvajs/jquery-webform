var Alert = require('./alert');
var config = require('./config');
var getTitle = require('./util').getTitle;
var format = require('./util').format;

var inputElem = document.createElement('input');
var html5Attrs = 'autocomplete autofocus list placeholder max min multiple pattern required step maxlength minlength'.split(' ');
var methods = [];
var validators = [];

var Webform = function(form, options) {
	var me = this;
	this.options = $.extend(true, {}, config, options || {});
	this.init(form);
};

Webform.prototype.init = function(form) {
	this.$form = $(form);
	if (this.options.forceSimulate) {
		this.$form.attr('novalidate', 'novalidate');
	}
	this.setLang();
	this.setInput(html5Attrs);
	this.runMethods();
	this.registeEvents();
};

Webform.prototype.setLang = function() {
	var lang = $('html').attr('lang');
	if (!lang) {
		lang = $('meta[http-equiv="Content-Language"]').attr('content');
	}
	this.options.lang = lang || config.lang;
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
	for (var j = 0; j < validators.length; j++) {
		var validator = validators[j];
		if ($.isFunction(validator) && !validator.call(this, $el)) {
			return false;
		}
	}
	return true;
};

Webform.prototype.alert = function(text, $el) {
	if (this.alertDialog) {
		this.alertDialog.remove();
	}
	//$el.attr('autocomplete', this.options.autocomplete);
	text += getTitle($el);
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