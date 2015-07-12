module.exports = function() {
	var form = this.$form.get(0);
	var autocomplete = this.options.autocomplete;
	$.each(form.elements, function(i, elem) {
		$(elem).attr('autocomplete', autocomplete);
	});
};