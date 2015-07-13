module.exports = function() {
	var lang = $('html').attr('lang');
	if (!lang) {
		lang = $('meta[http-equiv="Content-Language"]').attr('content');
	}
	if (lang) {
		this.options.lang = lang;	
	}
};