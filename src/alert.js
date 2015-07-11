var Alert = function(text, $el) {
    this.$el = $el;
    this.init(text, $el);
};

Alert.prototype = {
    timeout: 5000,

    init: function(text, $el) {
        if (this.dialog) return;

        var offset = this.$el.offset(),
            x = offset.left + 5,
            y = offset.top + this.$el.outerHeight() + 6;
        this.add(text, x, y);
        this.setTimer();
    },

    add: function(text, x, y) {
        var me = this;
        var html = ['<div class="webform-alert">',
            '<div class="webform-alert-icon"></div>',
            '<div class="webform-alert-icon webform-alert-icon2"></div>',
            '<div class="webform-alert-filter"></div>',
            '<span class="webform-alert-content">',
            text,
            '</span>',
            '</div>'
        ].join('');
        this.dialog = $(html);
        this.dialog.css({
            left: (x || 0) + 'px',
            top: (y || 0) + 'px'
        });
        $(document.body).append(this.dialog);
        this.registerEvents();
        return this;
    },

    remove: function() {
        this.dialog && this.dialog.remove();
        this.dialog = null;
        this.timer && clearTimeout(this.timer);
        this.off();
    },

    registerEvents: function() {
        var me = this;
        this.$el.on('keydown.webform', function() {
            var input = this;
            setTimeout(function() {
                var webform = $(input.form).data('webform');
                var pass = webform.runValidator($(input));
                if (pass) {
                    me.remove();
                }
            }, 0);
        });
        return this;
    },

    off: function() {
        this.$el.off('keydown.webform');
    },

    setTimer: function() {
        var me = this;
        this.timer = setTimeout(function() {
            me.remove();
            me.timer = null;
        }, this.timeout);
    },

    resetTimer: function() {
        this.timer && clearTimeout(this.timer);
        this.setTimer();
    },

    content: function(text) {
        if (!this.dialog) return;
        this.dialog.find('.webform-alert-content').html(text);
    }
};

module.exports = Alert;