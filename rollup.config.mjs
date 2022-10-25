// @ts-check
import url from 'url'
import path from 'path'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import bundleSize from 'rollup-plugin-bundle-size'

import pkg from './package.json' assert { type: 'json' }


// @ts-ignore
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = './src/index.ts'
const OUTPUT_FILE = './dist/index[mode][ext]'
const TSCONFIGJSON = path.resolve(__dirname, 'tsconfig.json')
const CACHEROOT = path.resolve(__dirname, 'node_modules/.rts2_cache')

function fileNameGen({ format, forProd }) {
  const ext = format === 'es' ? '.js' : '.cjs'
  const mode = forProd ? '.prod' : ''
  return OUTPUT_FILE.replace('[ext]', ext).replace('[mode]', mode)
}

// Do ts check only once per build
const tsCheck = {
  value: false,
  get() { return this.value },
  set(v) { this.value = v }
}

const configs = []

const buildContext = { format: 'es', tsCheck }

for (const forProd of [false, true]) {
  configs.push(createConfig({ ...buildContext, forProd }))
}

if (tsCheck.get()) {
  configs.push({
    input: './dts/index.d.ts',
    output: [{ file: pkg.typings, format: 'es' }],
    plugins: [
      dts(),
      del({ hook: 'buildEnd', targets: ['./dts'] })
    ],
  })
}

export default configs

/** @returns { import('rollup').RollupOptions } */
function createConfig(buildContext) {
  /** @type { import('rollup').OutputOptions } */
  const output = {
    format: buildContext.format,
    file: fileNameGen(buildContext),
    externalLiveBindings: false,
  }

  return {
    input: INPUT_FILE,
    plugins: [
      createReplacePlugin(buildContext),
      createTsPlugin(buildContext),
      resolve(),
      commonjs(),
      createTerserPlugin(buildContext),
      bundleSize(),
    ],
    output,
  }
}

function createReplacePlugin({ forProd }) {
  const replacements = {
    __PROD__: JSON.stringify(forProd),
    __DEV__: JSON.stringify(!forProd),
  }

  return replace({
    preventAssignment: true,
    values: replacements,
  })
}

function createTsPlugin({ tsCheck }) {
  const shouldCheck = !tsCheck.get()
  const shouldEmitDeclarations = !tsCheck.get()
  tsCheck.set(true)

  return ts({
    check: shouldCheck,
    tsconfig: TSCONFIGJSON,
    cacheRoot: CACHEROOT,
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: {
        declaration: shouldEmitDeclarations,
        declarationDir: './dts',
      },
    },
  })
}

function createTerserPlugin({ format }) {
  return terser({
    module: format == 'es',
    compress: {
      ecma: 2015,
      pure_getters: true,
    },
  })
}