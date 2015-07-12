require('./css-load');
var Webform = require('./webform');
var methods = require('./methods/index');
var validators = require('./validators/index');

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
