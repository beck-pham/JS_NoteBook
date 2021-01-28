import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => { // tells TS compilier that we gonna provide to CodeEditor a react component that receives any props from this interface.
  const onEditorDidMount = (getValue: () => string, monacoEditor: any) => {
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue())
    });
  };
  return <MonacoEditor
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
};

export default CodeEditor;