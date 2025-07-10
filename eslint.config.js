import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
  },
  ignores: ['src/types/axios.d.ts'],
})
