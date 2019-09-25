const rollup = require('rollup')
const zlib = require('zlib')
const terser = require('terser')
const fs = require('fs')
const path = require('path')

let builds = require('./config').getAllBuilds()

function build () {
  let index = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[index]).then(() => {
      index ++
      if (index < total) {
        next()
      }
    }).catch(logError)
  }
  next()
}

function buildEntry (config) {
  const { banner, file } = config.output
  return rollup.rollup(config)
    .then(bundle => bundle.generate(config.output))
    .then(({ output: [{ code }] }) => {
      const minified = (banner ? banner + '\n' : '') + terser.minify(code, {
        toplevel: true,
        output: {
          ascii_only: true
        },
        compress: {
          pure_funcs: ['makeMap']
        }
      }).code
      return write(file, minified, true)
    })
}


function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

build()