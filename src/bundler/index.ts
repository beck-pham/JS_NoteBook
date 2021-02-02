import * as esbuild from 'esbuild-wasm';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

// startup web assembly
let service: esbuild.Service;
const bundle = async (rawCode: string) => {
  // start and initialize the service one time
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    });
  }
  
  // This is where we are kicking off the entire bundling process
  try {
    const result = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(rawCode) // input = actual value of code when a user input in
      ], 
      define: {
        'process.env.NODE_ENV': '"production"', // whenever we find process.env.NODE_ENV, replace it with the 'production' string.
        global: 'window' // this is set whenever you try to bundling code inside a browser
      }
    });
    return {
      code: result.outputFiles[0].text,
      err: '',
    };
  } catch (err) {
    return {
      code: '',
      err: err.message,
    };
  }
}

export default bundle;