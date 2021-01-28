import * as esbuild from 'esbuild-wasm';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import CodeEditor from './components/code-editor';
import Preview from './components/preview';

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState(''); // the initial state of code that user write in the <textarea>
  const [code, setCode] = useState(''); // the initial state of esbuild tool code in the <pre> element
  // startup web assembly
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async() => {
    if (!ref.current) {
      return;
    }
    // This is where we are kicking off the entire bundling process
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(input) // input = actual value of code when a user input in
      ], 
      define: {
        'process.env.NODE_ENV': '"production"', // whenever we find process.env.NODE_ENV, replace it with the 'production' string.
        global: 'window' // this is set whenever you try to bundling code inside a browser
      }
    });
    // console.log(result);
    // after transpiling, update the code piece of state that will cause the component to render
    setCode(result.outputFiles[0].text);
  };

  return(
    <div>
      <CodeEditor 
        initialValue='Your code here...'
        onChange={(value) => setInput(value)}
      />
      {/* <textarea value ={input} onChange={e => setInput(e.target.value)}></textarea> */}
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)