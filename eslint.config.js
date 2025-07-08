import antfu from '@antfu/eslint-config'

export default antfu({
  lessOpinionated: true,
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },
  rules: {
    'ts/method-signature-style': 'off',
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
  },
})
