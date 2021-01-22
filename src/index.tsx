import * as esbuild from 'esbuild-wasm';
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

const App = () => {

  // startup web assembly
  const startService = async () => {
    const service = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    });
    console.log(service);
  };
  useEffect(() => {
    startService();
  }, []);

  const [input, setInput] = useState(''); // the initial state of code that user write in the <textarea>
  const [code, setCode] = useState(''); // the initial state of esbuild tool code in the <pre> element

  const onClick = () => {
    console.log(input)
  }
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