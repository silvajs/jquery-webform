exports.textFocus = function(v) {
    var v = typeof v === 'undefined' ? 'all' : parseInt(v);
    this.each(function() {
        var range, len;
        try {
            if (this.createTextRange) {
                range = this.createTextRange();
                v === 'all' ? range.collapse(false) : range.move("character", v);
                range.select();
            } else {
                len = this.value.length;
                v === 'all' ? this.setSelectionRange(len, len) : this.setSelectionRange(v, v);
            }
        } catch (e) {
            if (console && console.log) {
                console.log(e.message);
            }
        }
        this.focus();
    });
    return this;
};