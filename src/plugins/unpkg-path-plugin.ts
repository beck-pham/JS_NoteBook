import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache'
}); 

// (async () => {
//   await fileCache.setItem('color', 'red');

//   const color = fileCache.getItem('color');

//   console.log(color);
// })()

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        } 
        // dynamically query a custom/nested url
        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
          };
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        }
      });
 
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import React, { useState } from 'react-select';
              console.log(React, useState);
            `,
          };
        }
        // Check to see if we have already fetched this file
        // and if it is in the cache || Typescript: using a generic function to describe the type of return value which is onLoadResult from interface onLoad > onLoadResult
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
        // if it is, return it immediately
        if (cachedResult) {
          return cachedResult;
        }
        // parsing out property of built-in URL object
        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult =  {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        }
        //store response in cache
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};