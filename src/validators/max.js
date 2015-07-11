module.exports = function($el) {
    if (!$el.attr('max')) {
        return true;
    }
    var value = parseFloat($el.val());
    var max = parseFloat($el.attr('max'));
    if (value > max) {
        var text = this.getMessage('max', max);
        this.alert(text, $el);
        return false;
    }
    return true;
};