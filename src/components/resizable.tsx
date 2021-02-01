import { ResizableBox } from 'react-resizable';
import './resizable.css';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) =>{
  return (// eventually we want to put children comp 'CodeCell' inside Resizable
    <ResizableBox
      minConstraints={[Infinity, 60]}
      maxConstraints={[Infinity, window.innerHeight * 0.9]}
      height={300} 
      width={Infinity}
      resizeHandles={['s']}
    >
    {children}
    </ResizableBox>); 
};

export default Resizable;