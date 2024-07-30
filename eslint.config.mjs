import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        ignores: [
            'dist/**',
            'dist_spec/**',
            'jasmine.*.js*',
            'karma.config.js',
            'postbuild.js',
        ],
    },
];