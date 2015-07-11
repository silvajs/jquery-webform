require('./css-load');
var Webform = require('./webform');
var placeholder = require('./placeholder');
var autofocus = require('./autofocus');
require('./validate');

Webform.addMethods(placeholder, autofocus);

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
