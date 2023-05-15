module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    plugins: ['@typescript-eslint', 'prettier', 'react', 'react-hooks', 'import'],
    extends: [
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs

        /**
         * Typescript rules
         */
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'interface',
                format: ['PascalCase'],
                prefix: ['I'],
            },
        ],
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],

        /**
         * Base rules
         */

        // Disallow the use of alert, confirm, and prompt
        // https://eslint.org/docs/rules/no-alert
        'no-alert': 'error',

        // Allow use of undefined
        // https://eslint.org/docs/rules/no-undefined
        'no-undefined': 'off',

        // Warn about warning comments, e.g: todo, fixme
        // https://eslint.org/docs/2.0.0/rules/no-warning-comments
        'no-warning-comments': [
            'warn',
            {
                terms: ['todo', 'fixme', 'xxx'],
                location: 'start',
            },
        ],

        // Allow console.log only in development as warning for debugging purposes
        // Allow warning and error logs also in production
        // https://eslint.org/docs/rules/no-console
        'no-console': [
            process.env.NODE_ENV === 'production' ? 'error' : 'warn',
            {
                allow: ['error', 'warn'],
            },
        ],

        // Allow debugger with warning for development
        // https://eslint.org/docs/rules/no-debugger
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

        /**
         * React rules
         */

        // Enforce Rules of Hooks
        // https://github.com/facebook/react/blob/c11015ff4f610ac2924d1fc6d569a17657a404fd/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js
        'react-hooks/rules-of-hooks': 'error',

        // Verify the list of the dependencies for Hooks like useEffect and similar
        // https://github.com/facebook/react/blob/1204c789776cb01fbaf3e9f032e7e2ba85a44137/packages/eslint-plugin-react-hooks/src/ExhaustiveDeps.js
        'react-hooks/exhaustive-deps': 'error',

        // We don't use propTypes we use typed props instead
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
        'react/prop-types': 'off',

        // Prevent missing displayName in a React component definition, e.g. with forwardRef, etc.
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/display-name.md
        'react/display-name': ['off', { ignoreTranspilerName: false }],

        // Enforce boolean attributes notation in JSX
        // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
        'react/jsx-boolean-value': ['error', 'never', { always: [] }],

        /**
         * Import rules
         */

        // Allow using named exports as single export
        'import/prefer-default-export': 'off',

        // Do not allow a default import name to match a named export
        // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md
        'import/no-named-as-default': 'error',

        // Disallow duplicate imports
        // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md
        'import/no-duplicates': 'error',

        // Allow any order of import statements
        // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
        'import/order': 'off',
    },
};
