import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		}
	},
	{
		// TypeScript ya detecta identificadores no definidos (recomendacion de typescript-eslint)
		files: ['**/*.ts', '**/*.svelte'],
		rules: { 'no-undef': 'off' }
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		// tailwind.extend.snippet.js es un fragmento de referencia del kit de marca, no un modulo
		ignores: [
			'build/',
			'.svelte-kit/',
			'dist/',
			'node_modules/',
			'aws/',
			'background/',
			'tailwind.extend.snippet.js'
		]
	}
);
