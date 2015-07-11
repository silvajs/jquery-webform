var hasValue = require('../util').hasValue;

module.exports = function($el) {
    if (!$el.attr('required')) {
        return true;
    }

    if (!hasValue($el)) {
        var text = this.getMessage('required', $el);
        this.alert(text, $el);
        return false;
    }
    return true;
};