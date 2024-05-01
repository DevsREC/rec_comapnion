module.exports = {
	globDirectory: 'build/',
	globPatterns: [
		'**/*.{png,json,ico,html,txt,js,css,webp}'
	],
	swDest: 'build/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};