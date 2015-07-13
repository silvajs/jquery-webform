var Alert = require('./alert');
var config = require('./config');
var getTitle = require('./util').getTitle;
var format = require('./util').format;

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
	if (this.alertDialog) {
		this.alertDialog.remove();
	}
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