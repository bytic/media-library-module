import { build } from 'esbuild';

await build({
    entryPoints: ['resources/assets/js/standalone.js'],
    outdir: 'resources/assets/dist',
    entryNames: 'manager',
    bundle: true,
    format: 'iife',
    target: ['es2020'],
    minify: process.argv.includes('--minify'),
    legalComments: 'eof',
});
