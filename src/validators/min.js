module.exports = function($el) {
    if (!$el.attr('min')) {
        return true;
    }
    var value = parseFloat($el.val());
    var min = parseFloat($el.attr('min'));
    if (value < min) {
        var text = this.getMessage('min', $el);
        this.alert(text, $el);
        return false;
    }
    return true;
};