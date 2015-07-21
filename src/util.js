exports.getTitle = function(input) {
    var $el = $(input);
    return $el.attr('title') ? '：<i class="webform-title">' + $el.attr('title') + '</i>' : '';
}

exports.format = function(template) {
    var params = Array.prototype.slice.call(arguments, 1);
    $.each(params, function(i, n) {
        template = template.replace(new RegExp("\\{" + i + "\\}", "g"), function() {
            return n;
        });
    });
    return template;
}

exports.hasValue = function($el) {
    var elem = $el.get(0);
    if ($el.val().length > 0) {
        return true;
    }
    if (elem.validity && elem.validity.badInput) {
        return true;
    }
    return false;
}

exports.noValidate = function(form) {
    if (typeof form.noValidate !== 'undefined') {
        return form.noValidate;
    }
    if ($(form).attr('novalidate')) {
        return true;
    }
    return false;
}