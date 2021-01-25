import * as esbuild from 'esbuild-wasm';
import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState(''); // the initial state of code that user write in the <textarea>
  const [code, setCode] = useState(''); // the initial state of esbuild tool code in the <pre> element


  // startup web assembly
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    });
  };
  useEffect(() => {
    startService();
  }, []);


  const onClick = async() => {
    if (!ref.current) {
      return;
    }

    // const result = await ref.current.transform(input, {
    //   loader: 'jsx', // what kind of code
    //   target: 'es2015'
    // });
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"', // whenever we find process.env.NODE_ENV, replace it with the 'production' string.
        global: 'window' // this is set whenever you try to bundling code inside a browser
      }
    });

    console.log(result);
    
    // after transpiling, update the code piece of state that will cause the component to render
    setCode(result.outputFiles[0].text);
  };

  return(
    <div>
      <textarea value ={input} onChange={e => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)