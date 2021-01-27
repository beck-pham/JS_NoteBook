import * as esbuild from 'esbuild-wasm';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';



const App = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState(''); // the initial state of code that user write in the <textarea>
  //const [code, setCode] = useState(''); // the initial state of esbuild tool code in the <pre> element


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

    //resetting iframe to provide code consistency for user experience
    iframe.current.srcdoc = html;

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
    // setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  
  // iframe will execute code inside the script tag
  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try{
              eval(event.data);
            } catch (error) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red"><h4>Runtime Error</h4>' + error + '</div>'
              console.error(error);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  return(
    <div>
      <textarea value ={input} onChange={e => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      {/* <pre>{code}</pre> */}
      <iframe ref={iframe} title='preview' sandbox ='allow-scripts' srcDoc={html}/>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)