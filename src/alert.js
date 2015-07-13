var Alert = function(text, $el) {
    this.$el = $el;
    this.init(text, $el);
};

Alert.prototype = {
    timeout: 5000,

    init: function(text, $el) {
        this.remove();

        var offset = this.$el.offset(),
            x = offset.left + 5,
            y = offset.top + this.$el.outerHeight() + 6;
        this.add(text, x, y);
        this.setTimer();
    },

    add: function(text, x, y) {
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
        if (this.dialog) {
            this.dialog.remove();
            this.dialog = null;
        }
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
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
    }
};

module.exports = Alert;