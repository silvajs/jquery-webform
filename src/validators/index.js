var validators = [
	require('./required'),
	require('./email'),
	require('./number'),
	require('./min'),
	require('./max'),
	require('./minlength'),
	require('./maxlength'),
	require('./url'),
	require('./pattern'),
	require('./equalTo')
];

module.exports = validators;
