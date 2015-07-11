module.exports = function($el) {
    if (!$el.attr('pattern')) {
        return true;
    }

    var reg = new RegExp($el.attr('pattern'));
    if ($el.val().length > 0 && !reg.test($el.val())) {
        var text = this.getMessage('pattern', $el);
        this.alert(text, $el);
        return false;
    }
    return true;
};