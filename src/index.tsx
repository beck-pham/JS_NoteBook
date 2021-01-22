import * as esbuild from 'esbuild-wasm';
import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

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

    const result = await ref.current.transform(input, {
      loader: 'jsx', // what kind of code
      target: 'es2015'
    });

    setCode(result.code);
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