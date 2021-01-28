
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import bundle from './bundler';
import CodeEditor from './components/code-editor';
import Preview from './components/preview';

const App = () => {
  const [input, setInput] = useState(''); // the initial state of code that user write in the <textarea>
  const [code, setCode] = useState(''); // the initial state of esbuild tool code in the <pre> element
  
  const onClick = async() => {
    const output = await bundle(input);
    setCode(output);
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