var inputElem = document.createElement('input');
var html5Attrs = 'autocomplete autofocus list placeholder max min multiple pattern required step maxlength minlength'.split(' ');

module.exports = function() {
	this.input = {};
	for (var i = 0, len = html5Attrs.length; i < len; i++) {
		this.input[html5Attrs[i]] = !!(html5Attrs[i] in inputElem);
	}
	if (this.input.list) {
		this.input.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
	}
};