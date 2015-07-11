module.exports = function($el) {
    if ($el.attr('type') !== 'email') {
        return true;
    }
    var value = $el.val();
    if (!/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)) {
        var text = this.getMessage('email');
        this.alert(text, $el);
        return false;
    }
    return true;
};