module.exports = function() {
	if (this.input.autofocus) return;

	setTimeout(function() {
		$('[autofocus]').last().textFocus();
	}, 0);
};