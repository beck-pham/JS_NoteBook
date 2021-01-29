import * as esbuild from 'esbuild-wasm';

// (async () => {
//   await fileCache.setItem('color', 'red');

//   const color = fileCache.getItem('color');

//   console.log(color);
// })()

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // 1st case: esbuild is searching for index.js
      build.onResolve({ filter: /(^index\.js$)/}, () => {
        return {
          namespace: 'a',
          path: 'index.js'
        };
      })
      // 2nd case: esbuild finds a path to a relative module or relative file inside a module ------ dynamically query a custom/nested url
      build.onResolve({ filter: /^\.+\//}, (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
        };
      })
      // 3rd case: handle main file of a module
      build.onResolve({ filter: /.*/}, async (args: any) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        }
      })
    },
  };
};