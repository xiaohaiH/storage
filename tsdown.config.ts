import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    clean: true,
    format: ['esm', 'cjs', 'iife', 'umd'],
    outputOptions:{
        name: 'Storage',
    },
    dts: true,
});
