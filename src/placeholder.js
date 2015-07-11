var hasValue = require('./util').hasValue;

module.exports = function() {
    if (this.input.placeholder || !this.options.placeholder) return;

    $('[placeholder]').each(function(i, dom) {
        var input = $(dom);
        var text = input.attr('placeholder');
        input.removeAttr('placeholder');
        var id = dom.id || Math.random(),
            paddingLeft = input.css('padding-left'),
            paddingTop = input.css('padding-top'),
            paddingBottom = input.css('padding-bottom'),
            height = input.css('height'),
            borderLeftWidth = input.css('border-left-width'),
            borderTopWidth = input.css('border-top-width'),
            borderBottomWidth = input.css('border-bottom-width'),
            boxSizing = input.css('box-sizing'),
            lineHeight = input.height() + 'px';
        var style = [
            'padding-left:' + paddingLeft,
            'padding-top:' + paddingTop,
            'padding-bottom:' + paddingBottom,
            'height:' + height,
            'line-height:' + lineHeight,
            'border-left-width:' + borderLeftWidth,
            'border-top-width:' + borderTopWidth,
            'border-bottom-width:' + borderBottomWidth,
            'border-style:solid',
            'border-color:transparent',
            '_border-color:#fff;_filter:chroma(color=#fff);_margin-left: 1px;_zoom:1;_border-right:none',
            'box-sizing:' + boxSizing
        ];
        if (input.val().length > 0) {
            style.push('visibility:hidden');
        }
        dom.id = id;
        input.wrap('<div class="webform-placeholderWraper"></div>').after('<label for="' + id + '" class="webform-placeholderLabel" style="' + style.join(';') + '">' + text + '</label>');

    }).on('keydown.placeholder', function() {
        var $el = $(this);
        var placeholderLabel = $(this).next('.webform-placeholderLabel');
        setTimeout(function() {
            if (hasValue($el)) {
                placeholderLabel.css('visibility', 'hidden');
            } else {
                placeholderLabel.css('visibility', 'visible');
            }
        }, 0);

    });

};