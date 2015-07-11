module.exports = function($el) {
    if (!$el.attr('maxlength')) {
        return true;
    }
    var maxlength = parseInt($el.attr('maxlength'));
    var value = $el.val();
    if (value.length > maxlength) {
        var text = this.getMessage('maxlength', maxlength);
        this.alert(text, $el);
        return false;
    }
    return true;
};