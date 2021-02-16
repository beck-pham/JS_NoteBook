import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import './text-editor.css';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  //type annotation of HTML or Null with default starting value of Null
  const ref = useRef<HTMLDivElement | null > (null);
  const [editing, setEditing] = useState(false);
  // const [value, setValue] = useState('# HEADER');
  const { updateCell } = useActions();
  // The solution here is going to be comparing whether or not that element is the element the user just clicked on is inside of that div.
  // If it is inside, we're not going to flip the value of editing.
  // Otherwise, if it is outside, we will update editing to be false.
  useEffect(() => {
    const listener = (event: MouseEvent) => { // annotation for event object
      // check for ref pointing to the MDEditor <div>
      // make sure event.target is defined
      // compare the event target that clicked on is inside of that <div>
      if (ref.current && event.target && ref.current.contains(event.target as Node)) { // contains has a type definition of Node
        return;
      }
      setEditing(false);
    };
    document.addEventListener('click', listener, { capture: true });

    return () => {
      document.removeEventListener('click', listener, { capture: true })
    };
  }, []);

  /** EDITOR COMPONENT */
  if (editing) {
    return(
      <div className='text-editor' ref={ref}>
        <MDEditor value={cell.content} onChange={(value) => updateCell(cell.id, value || '')}/>
      </div>
    );
  }
  /** PREVIEW COMPONENT */
  return (
    <div className='text-editor card' onClick={() => setEditing(true)}>
      <div className='card-content'>
        <MDEditor.Markdown source={cell.content || 'Click to edit'} />
      </div>
    </div>
  )
}

export default TextEditor;


// So again, our solution here is going to be comparing whether or not that element just or whether or
// not the element the user just clicked on is inside of that div and that's pretty much it.
// If it is inside, we're not going to flip the value of editing.
// Otherwise, if it is outside, we will update editing to be false.