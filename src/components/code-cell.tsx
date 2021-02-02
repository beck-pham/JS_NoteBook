import React, { useState, useEffect } from 'react';
import bundle from '../bundler';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';


const CodeCell = () => {
  const [input, setInput] = useState(''); // the initial state of code that user write in the <textarea>
  const [code, setCode] = useState(''); // the initial state of esbuild tool code in the <pre> element
  const [err, setErr] = useState('');
  // if a user stop typing for 1 sec, the result of the code will be automatically execute
  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(input);
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    return () => {
      clearTimeout(timer);
    }
  }, [input])

  return (
    <Resizable direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction='horizontal'>
          <CodeEditor 
            initialValue='Your code here...'
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview code={code} err={err}/>
      </div>
    </Resizable>
  )
}

export default CodeCell;