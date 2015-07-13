module.exports = function($el) {
	var equalTo = $el.attr('equalTo');
	if (!equalTo) {
		return true;
	}
	var $equalTo = $(equalTo);
	if ($el.val() !== $equalTo.val()) {
		var text = this.getMessage('equalTo');
		this.alert(text, $el);
		return false;
	}
	return true;
};