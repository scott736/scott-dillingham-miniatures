import tsParser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';
import { importX } from 'eslint-plugin-import-x';

export default [
  ...astroPlugin.configs.recommended,
  {
    ignores: [
      'node_modules/**/*',
      'dist/**/*',
      '**/src/components/ui/**',
      '**/components/ui/**',
    ],
  },
  {
    files: ['**/*'],
    plugins: {
      'import-x': importX,
    },
    settings: {
      'import-x/core-modules': [
        'astro:assets',
        'astro:content',
        'astro:transitions',
      ],
    },
    rules: {
      'import-x/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
      },
    },
  },
];
