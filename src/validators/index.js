var validators = [
	require('./required'),
	require('./email'),
	require('./number'),
	require('./min'),
	require('./max'),
	require('./minlength'),
	require('./maxlength'),
	require('./url'),
	require('./pattern')
];

module.exports = validators;
