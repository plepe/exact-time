import replace from 'rollup-plugin-replace'

export default {
  entry: 'index.js',
  format: 'cjs',
  plugins: [
    replace({ 'process.env.BROWSER': !!process.env.BROWSER })
  ],
  external: ['http']
}
