/*
 * http://eslint.org/docs/rules/
 */
module.exports = {
    plugins: ['compat'],
    extends: ['pandora-typescript'],
    rules: {
        'import/no-webpack-loader-syntax': 0,
        'react/no-danger': 0,
        'react/jsx-no-constructed-context-values': 0,
        '@typescript-eslint/no-var-requires': 0,
        'compat/compat': 1,
    },
    settings: {
        polyfills: ['Promise'],
    },
};
