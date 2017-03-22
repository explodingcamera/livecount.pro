module.exports = {
	plugins: [
		require('postcss-cssnext')({warnForDuplicates: false}),
		require('cssnano')({zindex: false})
	]
};
