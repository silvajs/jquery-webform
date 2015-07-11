var css = require('./css');

var loadCss = function(styles) {
    var styleSheet,
        i = 0;
    if (document.createStyleSheet) {
        styleSheet = document.createStyleSheet();
    } else {
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(document.createElement('style'));
        styleSheet = document.styleSheets[document.styleSheets.length - 1];
    }
    
    for (var selector in styles) {
        if (styleSheet.insertRule) {
            styleSheet.insertRule(selector + '{' + styles[selector] + '}', i++);
        } else {
            styleSheet.addRule(selector, styles[selector], i++);
        }
    }
};

loadCss(css);