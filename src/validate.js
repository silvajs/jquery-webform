var Webform = require('./webform');
var required = require('./validators/required');
var email = require('./validators/email');
var number = require('./validators/number');
var min = require('./validators/min');
var max = require('./validators/max');
var minlength = require('./validators/minlength');
var maxlength = require('./validators/maxlength');
var url = require('./validators/url');
var pattern = require('./validators/pattern');

Webform.addValidators(required, email, pattern, number, min, max, minlength, maxlength, url);