var util = require('../util');

module.exports = function() {

	var form = this.$form.get(0);
	var formAttr = {
		action: form.action,
		enctype: form.enctype,
		method: form.method,
		novalidate: util.noValidate(form),
		target: form.target
	};

	function overrideForm($btn) {
		form.action = $btn.attr('formaction') || formAttr.action;
		form.enctype = $btn.attr('formenctype') || formAttr.enctype;
		form.method = $btn.attr('formmethod') || formAttr.method;
		form.novalidate = $btn.attr('formnovalidate') ? Boolean($btn.attr('formnovalidate')) : formAttr.novalidate;
		form.target = $btn.attr('formtarget') || formAttr.target;
	}

	this.$form.on('click', '[type="submit"]', function(e) {
		overrideForm($(e.currentTarget));
		e.stopPropagation();
	});
};