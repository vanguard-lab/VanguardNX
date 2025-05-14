import nx from '@nx/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  ...nx.configs['flat/base'],
  {
    ignores: ['**/dist', '**/node_modules', '**/*.d.ts', '**/.*', '**/migrations/*-migration.ts'],
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
      '@stylistic/ts': stylisticTs,
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': pluginUnusedImports,
    },
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
      '@typescript-eslint/adjacent-overload-signatures': ['warn'],
      '@typescript-eslint/await-thenable': ['error'],
      '@typescript-eslint/ban-types': ['off'],
      '@typescript-eslint/consistent-generic-constructors': ['warn', 'constructor'],
      '@typescript-eslint/consistent-indexed-object-style': ['off'],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'allow-as-parameter',
        },
      ],
      '@typescript-eslint/default-param-last': ['error'],
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
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': ['warn'],
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

      '@typescript-eslint/no-floating-promises': ['error'],
      '@typescript-eslint/promise-function-async': ['error'],
      '@typescript-eslint/no-confusing-non-null-assertion': ['warn'],
      '@typescript-eslint/no-confusing-void-expression': ['error'],
      '@typescript-eslint/no-dupe-class-members': ['error'],
      '@typescript-eslint/no-duplicate-enum-values': ['error'],
      '@typescript-eslint/no-empty-function': ['warn'],
      '@typescript-eslint/no-empty-interface': [
        'warn',
        {
          allowSingleExtends: true,
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'warn',
        {
          allowInterfaces: 'with-single-extends',
          allowObjectTypes: 'never',
        },
      ],
      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          fixToUnknown: false,
          ignoreRestArgs: true,
        },
      ],
      '@typescript-eslint/no-extra-non-null-assertion': ['error'],
      '@typescript-eslint/no-for-in-array': ['error'],
      '@typescript-eslint/no-implied-eval': ['error'],
      '@typescript-eslint/no-inferrable-types': [
        'warn',
        {
          ignoreParameters: true,
          ignoreProperties: false,
        },
      ],
      '@typescript-eslint/no-invalid-this': ['error'],
      '@typescript-eslint/no-loss-of-precision': ['error'],
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
      '@typescript-eslint/no-misused-new': ['error'],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksConditionals: true,
          checksSpreads: true,
        },
      ],
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': ['warn'],
      '@typescript-eslint/no-non-null-asserted-optional-chain': ['warn'],
      '@typescript-eslint/no-non-null-assertion': ['off'],
      '@typescript-eslint/no-redundant-type-constituents': ['warn'],
      '@typescript-eslint/no-require-imports': ['off'],
      '@typescript-eslint/no-this-alias': ['error', { allowDestructuring: false }],
      '@typescript-eslint/only-throw-error': ['error'],
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': [
        'warn',
        {
          allowComparingNullableBooleansToTrue: false,
          allowComparingNullableBooleansToFalse: false,
        },
      ],
      '@typescript-eslint/no-unnecessary-type-arguments': ['warn'],
      '@typescript-eslint/no-unnecessary-type-assertion': ['warn'],
      '@typescript-eslint/no-useless-empty-export': ['error'],
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: true,
          variables: true,
          allowNamedExports: false,
        },
      ],
      '@typescript-eslint/no-useless-constructor': ['off'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/prefer-enum-initializers': ['error'],
      '@typescript-eslint/prefer-includes': ['warn'],
      '@typescript-eslint/prefer-string-starts-ends-with': ['warn'],
      '@typescript-eslint/restrict-plus-operands': [
        'error',
        {
          skipCompoundAssignments: false,
          allowAny: true,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': ['warn'],
      '@typescript-eslint/unbound-method': ['warn'],

      '@stylistic/ts/lines-between-class-members': ['warn', 'always', { exceptAfterOverload: true, exceptAfterSingleLine: false }],
      '@stylistic/ts/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      ],

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
    },
  },
  {
    files: ['libs/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
    },
  },
];
