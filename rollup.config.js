import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

let pkg = require('./package.json')
let external = Object.keys(pkg.dependencies)

export default {
  input: 'src/nativetable/nativetable.js',
  external,
  plugins: [
    babel({
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              esmodules: false
            }
          }
        ]
      ],
      exclude: 'node_modules/**',
      babelrc: false
    }),
    uglify()
  ],
  output: [
    {
      file: pkg.main,
      name: 'nativetable',
      format: 'umd'
    }
  ]
}
