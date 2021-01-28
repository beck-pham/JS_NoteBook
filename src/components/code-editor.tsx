import { useRef } from 'react';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel'; // parser for advanced JS codes



interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => { // tells TS compilier that we gonna provide to CodeEditor a react component that receives any props from this interface.
  const editorRef = useRef<any>();
  
  /** MODULE 125, need descriptive comment */
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => { // annotate of EditorDidMount type
    editorRef.current = monacoEditor;
    // console.log(editorRef.current);
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue())
    });
    // change the tabsize to 2
    monacoEditor.getModel()?.updateOptions( {tabSize: 2 });
  };


  const onFormatClick = () => {
    // 1. get current value from editor. above getValue function will only help to achieve step 1. It will not be able to set the formatted value back to editor
    // Hence, we have to get a direct reference of monacoEditor
    const unformatted = editorRef.current.getModel().getValue(); // this will give us the current text value inside the editor
    // 2. format that value
    const formatted = prettier.format(unformatted, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true
    })
    // 3. set the formatted value back into the editor
    editorRef.current.setValue(formatted);

  }
  return (
    <div>
      <button onClick={onFormatClick}>Format</button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        theme="dark" 
        language="javascript" 
        height="50rem"
        options={{
          wordWrap: 'on', // When `wordWrap` = "on", the lines will wrap at the viewport width.
          minimap: { enabled: false },
          showUnused: false, // Controls fading out of unused variables.
          folding: false,
          fontSize: 20,
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />;
    </div>
  )  
};

export default CodeEditor;