import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache'
}); 

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // 1st case: handle root file index.js
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
       
          return {
            loader: 'jsx',
            contents: inputCode // input value of this plugin
          };
      });

      /*** Extract common code for both 2nd and 3rd case. Because there is no actual return, esbuild will continue to call next onLoad until a object is return ***/
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // LocalForage ---  Check to see if we have already fetched this file
        // and if it is in the cache || Typescript: using a generic function to describe the type of return value which is onLoadResult from interface onLoad > onLoadResult
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
        // if it is, return it immediately
        if (cachedResult) {
          return cachedResult;
        }
      });

      // 2nd case: handle css file
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style);
        `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        await fileCache.setItem(args.path, result);

        return result;
      });
      
      // 3rd case: handle plain JS file
       build.onLoad({ filter: /.*/ }, async (args: any) => {
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
    }
  }
}





