import replace from 'rollup-plugin-replace'

export default {
  input: 'index.js',
  output: {
    format: 'cjs'
  },
  plugins: [
    replace({ 'process.env.BROWSER': !!process.env.BROWSER })
  ],
  external: ['http']
}
