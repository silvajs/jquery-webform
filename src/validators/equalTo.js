module.exports = function($el) {
	var equalTo = $el.attr('equalTo');
	if (!equalTo) {
		return true;
	}
	var $equalTo = $(equalTo);
	if ($equalTo.length === 0) {
		this.alert('<b>Error</b>: the value of "equalTo" attribute must be jquery selector', $el);
		return false;
	}
	if ($el.val() !== $equalTo.val()) {
		var text = this.getMessage('equalTo');
		this.alert(text, $el);
		return false;
	}
	return true;
};