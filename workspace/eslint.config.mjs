import nx from '@nx/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  ...tseslint.configs.recommended,
  stylistic.configs.recommended,
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  {
    ignores: ['**/dist', '**/node_modules', '**/*.d.ts', '**/.*', '**/migrations/*-migration.ts'],
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },

  {
    files: ['apps/**/*.ts', 'libs/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig*.json', './apps/**/tsconfig*.json', './libs/**/tsconfig*.json'],
        tsconfigRootDir: path.resolve(__dirname),
        createDefaultProgram: true,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      '@stylistic/ts': stylisticTs,
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': pluginUnusedImports,
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@stylistic/ts/lines-between-class-members': ['warn', 'always', { exceptAfterOverload: true }],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-exports': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          fixToUnknown: false,
          ignoreRestArgs: true,
        },
      ],
      '@typescript-eslint/no-non-null-assertion': ['off'],
      '@typescript-eslint/no-empty-interface': [
        'warn',
        {
          allowSingleExtends: true,
        },
      ],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            accessors: 'explicit',
            constructors: 'no-public',
            methods: 'explicit',
            properties: 'explicit',
            parameterProperties: 'explicit',
          },
        },
      ],
      '@typescript-eslint/member-ordering': [
        'warn',
        {
          default: [
            'signature',
            'private-static-field',
            'protected-static-field',
            'public-static-field',
            ['private-static-get', 'private-static-set'],
            'private-instance-field',
            'private-decorated-field',
            'protected-instance-field',
            'protected-abstract-field',
            'protected-decorated-field',
            'public-instance-field',
            'public-abstract-field',
            'public-decorated-field',
            'constructor',
            ['private-get', 'private-set'],
            ['protected-get', 'protected-set'],
            ['public-get', 'public-set'],
            'public-instance-method',
            'public-abstract-method',
            'protected-instance-method',
            'protected-abstract-method',
            'private-instance-method',
            'public-static-method',
            'protected-static-method',
            'private-static-method',
          ],
        },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'allow-as-parameter',
        },
      ],
      '@typescript-eslint/no-unnecessary-type-assertion': ['warn'],
      '@typescript-eslint/no-unnecessary-type-arguments': ['warn'],
      '@typescript-eslint/no-confusing-non-null-assertion': ['warn'],
      '@typescript-eslint/no-confusing-void-expression': ['error'],
      '@typescript-eslint/no-redundant-type-constituents': ['warn'],
      '@typescript-eslint/switch-exhaustiveness-check': ['warn'],
      '@typescript-eslint/restrict-plus-operands': [
        'error',
        {
          allowAny: true,
        },
      ],
      'no-throw-literal': 'off',
      '@typescript-eslint/only-throw-error': 'error',
      '@typescript-eslint/prefer-enum-initializers': ['error'],
      '@typescript-eslint/prefer-includes': ['warn'],
      '@typescript-eslint/prefer-string-starts-ends-with': ['warn'],
      '@typescript-eslint/no-magic-numbers': [
        'warn',
        {
          ignore: [0, 1],
          ignoreArrayIndexes: false,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: false,
          enforceConst: true,
          detectObjects: true,
        },
      ],
      '@typescript-eslint/no-useless-empty-export': ['error'],
      '@typescript-eslint/unbound-method': ['warn'],
    },
  },
  {
    files: ['libs/**/*.ts', 'libs/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
];
