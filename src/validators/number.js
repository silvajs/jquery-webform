var hasValue = require('../util').hasValue;

module.exports = function($el) {
    if ($el.attr('type') !== 'number') {
        return true;
    }
    var value = $el.val();
    if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) || (hasValue($el) && value.length === 0)) {
        var text = this.getMessage('number', $el);
        this.alert(text, $el);
        return false;
    }
    return true;
};