const path = require('path')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const version = require('../package.json').version


const resolve = p => path.resolve(__dirname, '../', p)

const banner =
'/*!\n' +
` * Viewer.js v${version}\n` +
` * (c) 2019-${new Date().getFullYear()} wuchong \n` +
' * Released under the MIT License.\n' +
' */'

const builds = {
  'web-esm': {
    entry: resolve('src/index.js'),
    dest: resolve('dist/viewer.esm.min.js'),
    format: 'esm',
    banner
  },
  'web-umd': {
    entry: resolve('src/index.js'),
    dest: resolve('dist/viewer.min.js'),
    format: 'umd',
    name: 'Viewer',
    banner
  }
}

function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    plugins: [
      postcss(),
      babel()
    ],
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: 'Viewer'
    }
  }
  return config
}

exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
