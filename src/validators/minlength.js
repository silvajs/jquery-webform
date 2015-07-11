module.exports = function($el) {
    if (!$el.attr('minlength')) {
        return true;
    }
    var minlength = parseInt($el.attr('minlength'));
    var value = $el.val();
    if (value.length < minlength) {
        var text = this.getMessage('minlength', minlength);
        this.alert(text, $el);
        return false;
    }
    return true;
};