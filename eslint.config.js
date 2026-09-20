import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ['dist/', 'demo/', 'samples/', 'layout/', 'coverage/'],
    },
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.check.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ['**/*.js'],
        extends: [tseslint.configs.disableTypeChecked],
    },
    prettier
);
